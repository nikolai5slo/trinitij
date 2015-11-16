var FUCKER;

window.onload = function(){
	//Shranimo referenco na kanvas
	var canvas = document.querySelector("#canvas");

	//naložimo kanvas v babylonov izris
	var engine = new BABYLON.Engine(canvas, true);

  

  function createScene() {
	 var loader = null;
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0,0,3), new BABYLON.OimoJSPlugin());

    scene.actionManager = new BABYLON.ActionManager(scene);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    camera.attachControl(canvas, true);


    var astNest=AsteoridNest(scene);

    

	var igralec = new Igralec(scene);
	BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, 
			function(objectMeshes){
				FUCKER = objectMeshes[0].createInstance("igralec");	//ustvari novo instanco objekta z danim id-jem
			}
		);
	igralec.instanca = FUCKER;
	//igralec.instanca = "MADAFAKER";	//deluje in spremeni instanco
	console.log(igralec);
	
    

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 9000.0, scene);

    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/sky1/sky1", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.infiniteDistance = true;
    skybox.renderingGroupId = 0;

    skybox.material = skyboxMaterial;


    var sun=new Sun(camera, scene);
    sun.position = new BABYLON.Vector3(-2000, 50, 2000);
    sun.scaling = new BABYLON.Vector3(200, 200, 200);
   

    var earth=new Earth(5500.0, scene);
    earth.position=new BABYLON.Vector3(0,-5000,0)


  	// Create dynamic stars
  	return scene;
  };

	// Now, call the createScene function that you just finished creating
	var scene = createScene();

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop(function () {
		scene.render();
	});

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		engine.resize();
	});
}

function Sun(camera, scene){
  // Sun

  // Create the "God Rays" effect (volumetric light scattering)
  var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 80, BABYLON.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);

  // By default it uses a billboard to render the sun, just apply the desired texture
  // position and scale
  godrays.mesh.material.diffuseTexture = new BABYLON.Texture('textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
  godrays.mesh.material.diffuseTexture.hasAlpha = true;

  /*
  // Godrays parameters
  godrays.exposure = 0.4;
  godrays.decay = 0.96815;
  godrays.weight = 0.358767;
  godrays.density = 0.9526;
  */ 

  var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
  //light.position = godrays.mesh.position;
  light.parent=godrays.mesh;


  var ambiLight = new BABYLON.HemisphericLight("ambilight", new BABYLON.Vector3(0, 1, 0), scene);
  ambiLight.diffuse = new BABYLON.Color3(0.1, 0.1, 0.1);
  ambiLight.specular = new BABYLON.Color3(0, 0, 0);
  ambiLight.groundColor = new BABYLON.Color3(0, 0, 0);
  ambiLight.position = new BABYLON.Vector3(0,0,0); 

  ambiLight.parent=godrays.mesh;

  return godrays.mesh;
}
   