window.onload = function(){
	// Get the canvas element from our HTML below
	var canvas = document.querySelector("#canvas");

	// Load the BABYLON 3D engine
	var engine = new BABYLON.Engine(canvas, true);

    function createParticleMist(scene){
        var fountain = BABYLON.Mesh.CreateBox("fountain", 0.1, scene);
       
        var particleSystem = new BABYLON.ParticleSystem("particles", 30000, scene);
        fountain.position.y=0;
        fountain.position.x=0;
        fountain.position.z=0;
        particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
        particleSystem.emitRate = 1000;
        particleSystem.emitter = fountain;
        particleSystem.minEmitBox = new BABYLON.Vector3(700, -700, 700); // Starting all From
        particleSystem.maxEmitBox = new BABYLON.Vector3(-700, 700, -700); // To...
        particleSystem.minSize = 0.3;
        particleSystem.maxSize = 1;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
        particleSystem.textureMask = new BABYLON.Color4(1, 1, 1, 1);
        
        particleSystem.color1 = new BABYLON.Color4(1, 0.4, 0, 0);
        particleSystem.color2 = new BABYLON.Color4(0, 0, 0, 0);
        particleSystem.colorDead = new BABYLON.Color4(1, 1, 1, 1);
        
        particleSystem.maxLifeTime = 90;
        
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 1);
        particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);

        
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 1;
        
        particleSystem.updateSpeed = 0.1;
        // Start the particle system
        particleSystem.start();
    }


	function createScene() {
		var scene = new BABYLON.Scene(engine);

		scene.actionManager = new BABYLON.ActionManager(scene);

		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

		camera.attachControl(canvas, true);


        // Create paticle system
        createParticleMist(scene);

        //var asteroid = new Asteroid(20, scene);
        //var asteroid = BABYLON.Mesh.CreateSphere("Asteroid", 60, 10, scene, true);
        //url="asteroid.babylon"
        //url += (url.match(/\?/) == null ? "?" : "&") + (new Date()).getTime()
        BABYLON.SceneLoader.ImportMesh("Asteroid", "obj/", "asteroid.babylon", scene, function (m, particleSystems) {

            for (var index = 0; index < 50; index++) {
                var asteroid = m[0].createInstance("i" + index);

                asteroid.scaling.x*=1+Math.random()*2;
                asteroid.scaling.y*=1+Math.random()*2;
                asteroid.scaling.z*=1+Math.random()*2;
                asteroid.position.x=Math.random()*200-100;
                asteroid.position.y=Math.random()*200-100;
                asteroid.position.z=Math.random()*200-100;
                asteroid.rotation.x+=Math.random()*2
                asteroid.rotation.y+=Math.random()*2

                asteroid.material.specularTexture = new BABYLON.Texture("obj/astbump.jpg", scene);
                //asteroid.material.specularColor = new BABYLON.Color3(0.3, 0.2, 0.2);
                asteroid.material.specularPower = 2;

            }

            //asteroid.material.diffuseTexture = new BABYLON.Texture("obj/asteroid.Asteroid_TEXTURE.jpg", scene)
            //asteroid.material.diffuseTexture = new BABYLON.Texture("obj/asttext.png", scene)
            //asteroid.material.bumpTexture = new BABYLON.Texture("obj/astbump.jpg", scene);
            //asteroid.material = new BABYLON.StandardMaterial("skull", scene);
            //asteroid.material.emissiveTexture = new BABYLON.Texture("textures/ast.jpg", scene);
            //asteroid.material.diffuseTexture.uScale = 20000; 
            //asteroid.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

       });
        //var asteroid = BABYLON.SceneLoader.ImportMesh("Sphere", "obj/asteroid.babylon", "Sphere", scene, function (newMeshes, particleSystems) {});

       
        //var asteroid = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 5, radiusY: 8, subdivisions: 10, updatable: true}, scene);
        //asteroid.applyDisplacementMap("textures/dis.jpg", 0, 2.5);
   //     var disBuffer = new Uint8Array(800*800);
        //var val=256/2;
        /*for(var i=0;i<disBuffer.length;i++){
            //val+=Math.random()*10-10-10*((val-128)/128.0);
            disBuffer[i]=Math.random()*256;
            //disBuffer[i]=val;
        }*/
        //var disBuffer = Terrain(9,2);

        //asteroid.applyDisplacementMapFromBuffer(disBuffer, 9, 2 , 0 ,1.3);
/*
        asteroid.scaling.x*=1+Math.random()/2.0;
        asteroid.scaling.y*=1+Math.random()/2.0;
        asteroid.scaling.z*=1+Math.random()/2.0;
        */



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


    	// Create the "God Rays" effect (volumetric light scattering)
    	var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 80, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);

    	// By default it uses a billboard to render the sun, just apply the desired texture
    	// position and scale
    	godrays.mesh.material.diffuseTexture = new BABYLON.Texture('textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    	godrays.mesh.material.diffuseTexture.hasAlpha = true;
    	godrays.mesh.position = new BABYLON.Vector3(-2000, 50, 2000);
    	godrays.mesh.scaling = new BABYLON.Vector3(200, 200, 200);

    	/*
        // Godrays parameters
    	godrays.exposure = 0.4;
		godrays.decay = 0.96815;
		godrays.weight = 0.358767;
		godrays.density = 0.9526;
        */

    	light.position = godrays.mesh.position;


    	// Create earth
    	var earthMaterial = new BABYLON.StandardMaterial("earth", scene);
    	//var earthMaterial = new BABYLON.CubeTexture("earth", scene);
    	earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth1.jpg", scene);
		//earthMaterial.bumpTexture = new BABYLON.Texture("textures/earthbump.jpg", scene);
		earthMaterial.specularTexture = new BABYLON.Texture("textures/earthspec2.jpg", scene);
		earthMaterial.emissiveTexture = new BABYLON.Texture("textures/earthlights2.jpg", scene);
		earthMaterial.specularPower = 100; 


		var earth = BABYLON.Mesh.CreateSphere("sphere", 100.0, 1500.0, scene);
		earth.material=earthMaterial;
		earth.position=new BABYLON.Vector3(0,-1000,0)
		earth.rotation.x=Math.PI;


        // Earth rotation
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

    	atmosphereMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
    	atmosphereMaterial.opacityFresnelParameters.bias = 0.4;
    	atmosphereMaterial.opacityFresnelParameters.power = 1;
    	atmosphereMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
    	atmosphereMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();

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