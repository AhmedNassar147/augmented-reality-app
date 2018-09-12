import ExpoTHREE from 'expo-three';
import AssetUtils from 'expo-asset-utils';
import * as THREE from 'three';
import '../utilies/OBJLoader';
import '../utilies/MTLLoader';

export default class GooglePoly {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.currentResults = [];
    this.nextPageToken = "";
    this.keywords = "";
  }

  static getQueryURL(apiKey, keywords, nextPageToken) {
    const baseURL = "https://poly.googleapis.com/v1/assets?";

    let url = baseURL + "key=" + apiKey;
    url += "&pageSize=10";
    url += "&maxComplexity=MEDIUM";
    url += "&format=OBJ";
    if (keywords) { url += "&keywords=" + encodeURIComponent(keywords); }
    if (nextPageToken) { url += "&pageToken=" + nextPageToken; }
    return url;
  }

  // Sets current search parameters and resets member variables...
  setSearchParams = (keywords) => {
    this.currentResults = [];
    this.nextPageToken = "";
    this.keywords = keywords;
  }

  // Returns the results of the current query...
  getSearchResults() {
    const url = GooglePoly.getQueryURL(this.apiKey, this.keywords, this.nextPageToken);
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        this.currentResults = this.currentResults.concat(data.assets);
        this.nextPageToken = data.nextPageToken;
        return Promise.resolve(data.assets);
      })
  }


  static getThreeModel(objectData, success, failure) {
    if (!success) { success = function () { }; }
    if (!failure) { failure = function () { }; }
    if (!objectData) { failure("objectData is null"); return; }

    // Search for a format...
    var format = objectData.formats.find(format => format.formatType == "OBJ");
    if (format === undefined) { failure("No format found"); return; }

    // Search for a resource...
    var obj = format.root;
    var mtl = format.resources.find(resource => resource.url.endsWith("mtl"));
    var tex = format.resources.find(resource => resource.url.endsWith("png"));
    var path = obj.url.slice(0, obj.url.indexOf(obj.relativePath));

    // Load the MTL...
    var loader = new THREE.MTLLoader();
    loader.setCrossOrigin(true);
    loader.setTexturePath(path);
    loader.load(mtl.url, function (materials) {

      // Load the OBJ...
      loader = new THREE.OBJLoader();
      loader.setMaterials(materials);
      loader.load(obj.url, async function (object) {

        // If there is a texture, apply it...
        if (tex !== undefined) {
          var texUri = await AssetUtils.uriAsync(tex.url);
          var texture = new THREE.MeshBasicMaterial({ map: await ExpoTHREE.loadAsync(texUri) });
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = texture;
            }
          });
        }

        // Return the object...
        success(object);
      });
    });
  }

}