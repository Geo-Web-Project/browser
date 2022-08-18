const parseQueryVariables = (search) => {
  var query = {};
  var pairs = (search[0] === "?" ? search.substr(1) : search).split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    if (
      decodeURIComponent(pair[0]).toLowerCase() === "latitude" ||
      decodeURIComponent(pair[0]).toLowerCase() === "longitude"
    ) {
      if (parseInt(decodeURIComponent(pair[1]))) {
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
      }
    }
  }
  return query;
};

export default parseQueryVariables;
