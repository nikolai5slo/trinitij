window.onload = function(){
	// Get the canvas element from our HTML below
	var canvas = document.querySelector("#canvas");

	// Load the BABYLON 3D engine
	var engine = new BABYLON.Engine(canvas, true);

	function createScene() {
		var scene = new BABYLON.Scene(engine);

		scene.actionManager = new BABYLON.ActionManager(scene);

		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

		camera.attachControl(canvas, true);
		//camera.rotation.y=-0.5;
		//camera.position.z=-100;
		//camera.position.y=+100;


/*
        // Fog
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_NONE;
        //BABYLON.Scene.FOGMODE_EXP;
        //BABYLON.Scene.FOGMODE_EXP2;
        //BABYLON.Scene.FOGMODE_LINEAR;

        scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
        scene.fogDensity = 0.01;

        //Only if LINEAR
        //scene.fogStart = 20.0;

        */
        //scene.fogEnd = 60.0;



        var skyboxMaterial = new BABYLON.ShaderMaterial("skyboxMaterial", scene, {
            vertexElement: "vertexShaderCode",
            fragmentElement: "fragmentShaderCode",
        },
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection"]
        });
        
        var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        ground.material = skyboxMaterial;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 9000.0, scene);

        //var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/sky34/sky1", scene);
        //skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.infiniteDistance = true;
        skybox.renderingGroupId = 0;

        skybox.material = skyboxMaterial;

        var alpha = 255;
        scene.registerBeforeRender(function () {

        	scene.fogDensity = Math.cos(alpha) / 10;
            //alpha += 0.02;

        });

    	// Create the "God Rays" effect (volumetric light scattering)
    	var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 80, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);

    	// By default it uses a billboard to render the sun, just apply the desired texture
    	// position and scale
    	godrays.mesh.material.diffuseTexture = new BABYLON.Texture('textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    	godrays.mesh.material.diffuseTexture.hasAlpha = true;
    	godrays.mesh.position = new BABYLON.Vector3(-2000, 50, 2000);
    	godrays.mesh.scaling = new BABYLON.Vector3(200, 200, 200);

    	/*
    	godrays.exposure = 0.4;
		godrays.decay = 0.96815;
		godrays.weight = 0.358767;
		godrays.density = 0.9526;
*/

    	light.position = godrays.mesh.position;

    	/*
    	for(var i=0;i<200;i++){
    		var point = new BABYLON.Mesh("point", scene);
    		point.position = new BABYLON.Vector3(0,Math.random()*100,Math.random()*100);
    		point.material=material1
    	}

    	*/

    	// Create earth
    	var earthMaterial = new BABYLON.StandardMaterial("earth", scene);
    	//var earthMaterial = new BABYLON.CubeTexture("earth", scene);
    	earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth1.jpg", scene);
		//earthMaterial.bumpTexture = new BABYLON.Texture("textures/earthbump.jpg", scene);
		earthMaterial.specularTexture = new BABYLON.Texture("textures/earthspec2.jpg", scene);
		earthMaterial.emissiveTexture = new BABYLON.Texture("textures/earthlights2.jpg", scene);
		earthMaterial.specularPower = 100; 

		//var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);


		var earth = BABYLON.Mesh.CreateSphere("sphere", 100.0, 1500.0, scene);
		earth.material=earthMaterial;
		earth.position=new BABYLON.Vector3(0,-1000,0)
		earth.rotation.x=Math.PI;


		scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, earth, "rotation.y", 0.0002));

		var atmosphere = BABYLON.Mesh.CreateSphere("atmosphere", 100.0, 1505.0, scene);
		var atmosphereMaterial = new BABYLON.StandardMaterial("atmosphere", scene);
		atmosphereMaterial.diffuseColor = new BABYLON.Color3(0.4,0.4,1);
		//atmosphereMaterial.emissiveColor = new BABYLON.Color3(0,0,0.3);
		//atmosphereMaterial.ambientColor = new BABYLON.Color3(0,0,1);
		atmosphereMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.6);
		atmosphereMaterial.alpha = 0.1;
		atmosphereMaterial.specularPower = 2;
		atmosphere.material = atmosphereMaterial;
		atmosphere.position = earth.position;
/*
		atmosphereMaterial.diffuseFresnelParameters = new BABYLON.FresnelParameters();
    	atmosphereMaterial.diffuseFresnelParameters.bias = 0.5;
    	atmosphereMaterial.diffuseFresnelParameters.power = 2;
    	atmosphereMaterial.diffuseFresnelParameters.rightColor = BABYLON.Color3.Black();
    	atmosphereMaterial.diffuseFresnelParameters.leftColor = BABYLON.Color3.White();
    	*/
    	atmosphereMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
    	atmosphereMaterial.opacityFresnelParameters.bias = 0.4;
    	atmosphereMaterial.opacityFresnelParameters.power = 1;
    	atmosphereMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
    	atmosphereMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
/*
    	atmosphereMaterial.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    	atmosphereMaterial.emissiveFresnelParameters.bias = 0.5;
    	atmosphereMaterial.emissiveFresnelParameters.power = 2;
    	atmosphereMaterial.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
    	atmosphereMaterial.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    	*/
		/////

		var light0 = new BABYLON.HemisphericLight("ambilight", new BABYLON.Vector3(0, 1, 0), scene);
		light0.diffuse = new BABYLON.Color3(0.1, 0.1, 0.1);
		light0.specular = new BABYLON.Color3(0, 0, 0);
		light0.groundColor = new BABYLON.Color3(0, 0, 0);
		light0.position = new BABYLON.Vector3(0,0,0);
		//godrays.mesh.position;
		

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