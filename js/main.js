window.onload = function(){
	// Get the canvas element from our HTML below
	var canvas = document.querySelector("#canvas");

	// Load the BABYLON 3D engine
	var engine = new BABYLON.Engine(canvas, true);

    function randomNumber(min, max){
        return (Math.random()*(max-min))+min;
    }

    Comet = function(radius, scene) {
        // Call the super class BABYLON.Mesh
        BABYLON.Mesh.call(this, "comet", scene);


        // Sphere shape creation
        var vertexData = BABYLON.VertexData.CreateSphere(radius,2);
        // Apply the shape to our tree
        vertexData.applyToMesh(this, false);

        var positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var numberOfPoints = positions.length/3;

        // Build a map containing all vertices at the same position
        var map = [];
        for (var i=0; i<numberOfPoints; i++) {
            var p =new  BABYLON.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]);

            var found = false;
            for (var index=0; index<map.length&&!found; index++) {
                var array = map[index];
                var p0 = array[0];
                if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
                    array.push(i*3);
                    found = true;
                }
            }
            if (!found) {
                var array = [];
                array.push(p, i*3);
                map.push(array);
            }
        }
/*
        var that = this;
        // For each vertex at a given position, move it with a random value
        map.forEach(function(array) {
            var index, min = 0, max = 3;
            var rx = randomNumber(min,max);
            var ry = randomNumber(min,max);
            var rz = randomNumber(min,max);

            for (index = 1; index<array.length; index++) {
                var i = array[index];
                positions[i] += rx;
                positions[i+1] += ry;
                positions[i+2] += rz;
            }
        });
*/

        this.convertToFlatShadedMesh();
    
    };

    // Our object is a BABYLON.Mesh
    Comet.prototype = Object.create(BABYLON.Mesh.prototype);
    // And its constructor is the Tree function described above.
    Comet.prototype.constructor = Comet;

   

    function createCometNest(){

    }

	function createScene() {
		var scene = new BABYLON.Scene(engine);

		scene.actionManager = new BABYLON.ActionManager(scene);

		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

		camera.attachControl(canvas, true);


        var comet = new Comet(2, scene);



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