import React, {useEffect, useState} from 'react';
import GWEmpty from '../../../../components/common/ContentFiller/Empty';

import './styles.css';

const gwGateway = process.env.REACT_APP_IPFS_GATEWAY;

const ModelViewer = (props) => {

    let url = props.url;
    let modelRef = props.modelRef; 

    useEffect(()=>{
        modelRef.current.src = url;
    }, [url]);

    return(
        <model-viewer ref={modelRef} className='gwCanvas' src={""} 
            shadow-intensity="1" ar ar-modes="webxr scene-viewer quick-look"  
            auto-rotate camera-controls alt="Lake Boat">
            
            <button slot="ar-button" id="ar-button" />

            <div id="ar-prompt">
                <img id="ar-prompt-img" />
            </div>

            <button id="ar-failure">
                AR is not tracking!
            </button>

        </model-viewer>
    );
}

const GWCanvas = (props) =>{
    
    const gwCanvasContent = props.gwCanvasContent;
    let [modelIndex, setModelIndex] = useState(0);
    let modelRef = React.createRef();

    let [modelUrl, setModelUrl] = useState("");

    useEffect(()=>{

        if(gwCanvasContent) 
        {
            modelUrl = gwGateway + gwCanvasContent[modelIndex].contentUrl; 
            setModelUrl(modelUrl);
        }

    }, []);

    const clickLeft = () => {
        
        if(gwCanvasContent === null) return;

        modelIndex = modelIndex - 1;

        if(modelIndex < 0)
            modelIndex = gwCanvasContent.length - 1;

        setModelIndex(modelIndex);
        var _src = gwGateway + gwCanvasContent[modelIndex].contentUrl;
        setModelUrl(_src);

    }

    const clickRight = () => {
        
        if(gwCanvasContent === null) return;

        modelIndex = modelIndex + 1;

        if(modelIndex > gwCanvasContent.length - 1)
            modelIndex = 0;

        setModelIndex(modelIndex);
        var _src = gwGateway + gwCanvasContent[modelIndex].contentUrl;
        setModelUrl(_src);

    }


    if(gwCanvasContent !== null) {
        return(
            <div>
                <button className="clk-left" onClick={ ()=>clickLeft() } />
                <ModelViewer modelRef={modelRef} url={modelUrl} />
                <button className="clk-right" onClick={ ()=>clickRight() } />
            </div>
        );
    }
    else {
        return <GWEmpty promptType='gallery' />
    }

}

export default GWCanvas;