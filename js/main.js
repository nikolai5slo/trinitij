var FUCKER;

window.onload = function(){
	//Shranimo referenco na kanvas
	var canvas = document.querySelector("#canvas");

	//naložimo kanvas v babylonov izris
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
	var loader = null;
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0,0,0.005), new BABYLON.OimoJSPlugin());

    scene.actionManager = new BABYLON.ActionManager(scene);

    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    camera.attachControl(canvas, true);


    // Create paticle system
      createParticleMist(scene);

    // Add asteroids
    var url = "http://jerome.bousquie.fr/BJS/images/rock.jpg";
    var mat = new BABYLON.StandardMaterial("mat1", scene);
    var texture = new BABYLON.Texture(url, scene);
    mat.diffuseTexture = texture;
    mat.backFaceCulling = false;

    var fact = 600;   // density
    var scaleX = 0.0;
    var scaleY = 0.0;
    var scaleZ = 0.0;
    var grey = 0.0; 

    // custom vertex function
    var myVertexFunction = function(particle, vertex, i) {
      vertex.x *= (Math.random() + 1);
      vertex.y *= (Math.random() + 1);
      vertex.z *= (Math.random() + 1);
    };

    // Particle system creation : Immutable

    var SPS = new BABYLON.SolidParticleSystem('SPS', scene, {updatable: false});
    var sphere = BABYLON.MeshBuilder.CreateSphere("s", {diameter: 6, segments: 3}, scene);
    SPS.addShape(sphere, 200, {vertexFunction: myVertexFunction}) ;
    var mesh = SPS.buildMesh();
    mesh.position.z=0;
    mesh.material = mat;
    // dispose the model
    sphere.dispose();


    SPS.initParticles = function() {
      // just recycle everything
      for (var p = 0; p < this.nbParticles; p++) {
        this.recycleParticle(this.particles[p]);
        this.particles[p].position.x = Math.random() * 200 - 100;
        this.particles[p].position.y = Math.random() * 200 - 100;
        this.particles[p].position.z = Math.random() * 1200 -500;
      }
    };


    // recycle
    SPS.recycleParticle = function(particle) {
      scaleX = Math.random()/2  + 0.1;
      scaleY = Math.random()/2 + 0.1;
      scaleZ = Math.random()/2 + 0.1;
      particle.scale.x = scaleX;
      particle.scale.y = scaleY;
      particle.scale.z = scaleZ;
      particle.position.x = Math.random() * 200 - 100;
      particle.position.y = Math.random() * 200 - 100;
      particle.position.z = -500;
      particle.rotation.x = Math.random() * 3.5;
      particle.rotation.y = Math.random() * 3.5;
      particle.rotation.z = Math.random() * 3.5;
      grey = 1.0 - Math.random() * 0.3;
      particle.color = new BABYLON.Color4(grey, grey, grey, 1);

      particle.velocity.z =  Math.random() * 2;
      particle.velocity.x =  Math.random()/2 - 0.25;
      particle.velocity.y =  Math.random()/2 - 0.25;
    };


    // update : will be called by setParticles()
    SPS.updateParticle = function(particle) {  
      // some physics here 
      if (particle.position.z > 800) {
        this.recycleParticle(particle);
      }
      //particle.velocity.y += gravity;                         // apply gravity to y
      (particle.position).addInPlace(particle.velocity);      // update particle new position
      //particle.position.y += speed / 2;
      
      var sign = (particle.idx % 2 == 0) ? 1 : -1;            // rotation sign and new value
      particle.rotation.z += 0.009 * sign;
      particle.rotation.x += 0.003 * sign;
      particle.rotation.y += 0.002 * sign;
    }; 


    // init all particle values and set them once to apply textures, colors, etc
    SPS.initParticles();
    //SPS.updateParticleVertex = myVertexFunction;

    SPS.setParticles();
    SPS.refreshVisibleSize();  

    SPS.computeParticleVertex = false; 

    // Tuning : 
    SPS.computeParticleColor = false;
    SPS.computeParticleTexture = false;

    // SPS mesh animation
    scene.registerBeforeRender(function() {
    SPS.setParticles();
    SPS.refreshVisibleSize();  
    SPS.computeParticleVertex = false;
    });

	var igralec = new Igralec(scene);
	BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, 
			function(objectMeshes){
				FUCKER = objectMeshes[0].createInstance("igralec");	//ustvari novo instanco objekta z danim id-jem
			}
		);
	igralec.instanca = FUCKER;
	//igralec.instanca = "MADAFAKER";	//deluje in spremeni instanco
	console.log(igralec);
	
    var asteroids= [];
	/*loader = new AsteoridLoader(scene);
	//console.log(loader);
	//console.log(loader.mesh);
	//console.log(loader.material);
	for (var index = 0; index < 200; index++) {
		var tmpAster = new Asteroid();
		tmpAster.createAsteroid(loader, index);
		asteroids.push(tmpAster);
	}*/
	
    asteroidMaterial = null;
    BABYLON.SceneLoader.ImportMesh("Asteroid", "obj/", "asteroid1.babylon", scene, function (m, particleSystems) {
      for (var index = 0; index < 200; index++) {
        var asteroid = m[0].createInstance("i" + index);
        asteroids.push(asteroid);

        asteroid.scaling.x*=1+Math.random()*2;
        asteroid.scaling.y*=1+Math.random()*2;
        asteroid.scaling.z*=1+Math.random()*2;
        asteroid.position.x=Math.random()*200-100;
        asteroid.position.y=Math.random()*200-100;
        asteroid.position.z=Math.random()*1200-500;
        asteroid.rotation.x+=Math.random()*2
        asteroid.rotation.y+=Math.random()*2

        if(asteroidMaterial==null){
          asteroid.material.specularTexture = new BABYLON.Texture("obj/astbump.jpg", scene);
          //asteroid.material.specularColor = new BABYLON.Color3(0.3, 0.2, 0.2);
          asteroid.material.specularPower = 2;

          asteroidMaterial = asteroid.material;
        }else asteroid.material=asteroidMaterial;


        asteroid.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:1.5, friction:0.5, restitution:0.5});
        asteroid.applyImpulse(new BABYLON.Vector3(Math.random()*10-5,Math.random()*10-5,Math.random()*5+5), asteroid.position);

        }
    });
	console.log(asteroidMaterial);	//TO FAKING NE DELA KOT BI MORALO!!!! Je null

    scene.registerBeforeRender(function() {
		asteroids.forEach(function(objekt){
			if(objekt.position.z > 700){
				objekt.position.z = -500;
			}
		});
    });

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