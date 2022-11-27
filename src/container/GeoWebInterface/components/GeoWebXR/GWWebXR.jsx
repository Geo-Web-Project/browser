import { useEffect, useState, useRef } from "react";
import GWEmpty from "../../../../components/common/ContentFiller/Empty";
import ContentLabel from "../../../../components/common/ContentLabel/ContentLabel";

import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as geolib from 'geolib';


import styles from "./styles.module.css";

const gwGateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY;

// three js variables
let camera
let scene
let renderer
let canvas
let offsetPosition = new THREE.Vector3()
const gltfloader = new GLTFLoader();
let sceneObject
let mixer
const clock = new THREE.Clock();
// webxr variable
let session
let gl

// geolib variable
let compassAngle = 0
let needNorth = true
let thumBearing
let headingAngle
let distanceGeo
let targetLng
let targetLat
let isInRange = false
let targetMarket
let currentLat
let currentLng



const ARNotSupport = (props) => {
  return (
    <div>
      <button>WebXR API not supoort</button>
    </div>
  )
}

const StartARCanvas = (props) => {

  const gwWebxrContent = props.gwWebxrContent
  const arButton = useRef()
  const [loading, setLoading] = useState(0)
  const [currentGPS, setCurrentGPS] = useState()

  const calculateInitData = () => {
    distanceGeo = geolib.getDistance({
      latitude: targetLat,
      longitude: targetLng,
    }, {
      latitude: currentLat,
      longitude: currentLng,
    })

    thumBearing = geolib.getRhumbLineBearing(
      {
        latitude: targetLat,
        longitude: targetLng,
      },
      {
        latitude: currentLat,
        longitude: currentLng,
      }
    )
    isInRange = geolib.isPointWithinRadius(
      {
        latitude: targetLat,
        longitude: targetLng,
      },
      {
        latitude: currentLat,
        longitude: currentLng,
      },
      100
    );
  }

  const startAR = async (e) => {
    if (currentGPS) {
      currentLng = currentGPS.lng
      currentLng = currentGPS.lat
      targetLng = props.lng || currentLng
      targetLat = props.lat ||  currentGPS.lat + 0.00005
      console.log({ currentLat, currentLng, targetLat, targetLng })
      calculateInitData()
    }
    const arPermissionGranded = await window.navigator.xr.isSessionSupported(
      "immersive-ar"
    );
    if (arPermissionGranded && !session) {
      sessionStart()
    } else {
      console.log("AR Not Support");
    }
  }


  // start AR session
  const sessionStart = async () => {
    // three js variables

    document.querySelector("#overlay").style.display = "flex"

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    canvas = document.createElement("canvas");
    gl = canvas.getContext("webgl", {
      xrCompatible: true,
    });

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // set three js realistic rendering
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.xr.enabled = true; // need set xr to true for webxr api
    renderer.outputEncoding = THREE.sRGBEncoding;

    // three js enviroment light 
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;

    // add three js group, it will contain all ar objects
    const arScene = new THREE.Group()
    scene.add(arScene)

    // calculate variables for ar scene rotation offsets
    const offsetAn = THREE.MathUtils.degToRad(compassAngle)
    const radians = THREE.MathUtils.degToRad(thumBearing)
    const angle = new THREE.Vector3(0, 0, 1)
    angle.applyAxisAngle(new THREE.Vector3(0, 1, 0), -radians)
    // set offsets position and rotation
    offsetPosition.set(0,0,0)
    offsetPosition.addScaledVector(angle, distanceGeo)
    arScene.rotation.set(0, -offsetAn, 0)
    console.log({ compassAngle, offsetAn, angle, radians })

    // get cid glb file url
    const cid = gwWebxrContent[0].contentUrl.replace("ipfs://", "");
    const sceneFile = gwGateway + cid;
    // const sceneFile = "https://xrshirts.s3.dualstack.us-east-1.amazonaws.com/geoweb/assets/hot_air_balloon.glb"
    
    // load ar 3d object: glb gltf fomat: this will take a bit time
    gltfloader.load(
      sceneFile,
      (gltf) => {
        sceneObject = gltf.scene
        const scale = 1
        gltf.scene.scale.set(scale, scale, scale)
        gltf.scene.position.copy(offsetPosition)
        arScene.add(gltf.scene);

        // play animation if any, only play the first one
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // enable double side
        gltf.scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.material.side = THREE.DoubleSide
          }
        });

        // console.log(gltf)
      },
      function (xhr) {
        // called when loading 3d files
        console.log(xhr)
        let amount = Math.floor((xhr.loaded / xhr.total) * 100);
        setLoading(amount)
      },
      function (error) {
        // called when loading has errors
        console.log("An error happened when load glb");
      }
    );

    // debug helpers
    // const gridHelper = new THREE.GridHelper();
    // const axesHelper = new THREE.AxesHelper(5);
    // arScene.add(gridHelper);

    // webxr ar session
    session = await navigator.xr.requestSession("immersive-ar", {
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.querySelector("#overlay") },
      requiredFeatures: ["local-floor"],

    });
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });
    renderer.xr.setReferenceSpaceType("local-floor");
    await renderer.xr.setSession(session);
    session.requestAnimationFrame(onXRFrame);
    session.addEventListener('end', onSessionEnded);
    // render animation for XR session
    function onXRFrame(t, frame) {
      let session = frame.session;
      session.requestAnimationFrame(onXRFrame);

      // 3d object auto rotation
      if (sceneObject) sceneObject.rotateY(0.01);


      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    }
    function onSessionEnded(){
      document.querySelector("#overlay").style.display = "none"
      session = null
    }

  }


  useEffect(() => {
    window.addEventListener('deviceorientationabsolute', (e) => {
      if (needNorth) {
        compassAngle = e.alpha
        // console.log(compassAngle)
      }
    }, true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        currentLng = position.coords.longitude
        currentLat = position.coords.latitude
        setCurrentGPS({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        console.log({ currentGPS })
      });
    } else {
      console.log("geolocation IS NOT available")
    }
  }, [])


  return (
    <div>
      {currentGPS ?
        <button
          ref={arButton}
          style={{
            marginTop: "150px",
            backgroundColor:" #ff833c",
            padding:"5px 10px",
            borderRadius: "2px",
            fontFamily: "'Open Sans', sans-serif",
            color:"#fff",
            fontSize: "25px",
            fontWeight: "600",
            letterSpacing: "3px",
            textTransform: "uppercase",
            borderStyle: "none",
          }}
          onClick={startAR}
        >Start AR</button>
        :
        <button
          ref={arButton}
          style={{
            marginTop: "150px",
            padding: "20px",
            fontSize: "21px",
          }}
        >Loading GPS Data</button>
      }

      <div id="overlay"
      style={{
        display:"none",
        alignContent:" center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color:"white",
        gap:"20px",
      }}
      >
        {loading < 100 ?<div>loading AR Contents</div>: null}
        {loading < 100 ?<div>{`${loading}%`}</div>: null}
      </div>
    </div>
  )
}


const GWWebXR = (props) => {
  const gwWebxrContent = props.gwWebxrContent;
  let [modelIndex, setModelIndex] = useState(0);
  let modelRef = useRef();

  let [modelUrl, setModelUrl] = useState("");
  let [modelName, setModelName] = useState("");

  let [isArSupported, setIsArSupported] = useState(false)

  const checkARsupported = async () => {
    const isARSupported = await window.navigator.xr.isSessionSupported(
      "immersive-ar"
    );
    if (isARSupported && !session) {
      // startAr()
      setIsArSupported(true)
    } else {
      console.log("AR Not Support");
      setIsArSupported(false)
    }

  }


  useEffect(() => {
    if (!gwWebxrContent) return;
    const cid = gwWebxrContent[modelIndex].contentUrl.replace("ipfs://", "");
    modelUrl = gwGateway + cid;
    setModelUrl(modelUrl);
    setModelName(gwWebxrContent[modelIndex]["name"]);
    console.log({ modelUrl, isArSupported, gwWebxrContent })
    checkARsupported()

  }, [gwWebxrContent, isArSupported]);

  if (gwWebxrContent) {
    if (isArSupported) {
      return <StartARCanvas gwWebxrContent={gwWebxrContent} />;
    } else {
      return <ARNotSupport />;
    }
  } else {
    return <GWEmpty promptType="AR Objects" />;
  }
};

export default GWWebXR;
