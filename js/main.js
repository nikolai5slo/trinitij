<<<<<<< HEAD
var ST_NASPROTNIKOV;
var TIRNITIJ_DEF_POS;
var NASPROTNIK_START_DIST;
var NASPROTNIK_DEATH_DIST;

document.onload = function() {
	ST_NASPROTNIKOV = 15;
	TIRNITIJ_DEF_POS = [0, 0, 250];
	NASPROTNIK_START_DIST = 750;
	NASPROTNIK_DEATH_DIST = 500;
}
window.onload = function() {
	var igralec;
	var trinitij;
	var nasprotniki = [];
	
=======
var FUCKER;


function randomNumber(min,max){
  return (Math.random()*(max-min))+min;
}

window.onload = function(){
>>>>>>> origin/master
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


<<<<<<< HEAD
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
	
	/*********************
		KREACIJA LIKOV
	**********************/
	
	igralec = new Igralec();					//ustvarimo novega igralca
	igralec.create(igralec.instanca, scene);	//kreiramo njegov objekt in ga dodamo v sceno
	trinitij = new Trinitij();					//ustvarimo ladjo trinitij
	trinitij.create(trinitij.instanca, scene);	//kreiramo njen objekt in jo dodamo v sceno
	console.log(ST_NASPROTNIKOV);
	for(i = 0; i < ST_NASPROTNIKOV; i++){		//za N nasprotnikov
		var tmp = new Nasprotnik();					//ustvarimo novega nasprotnika
		tmp.create(tmp.instanca, scene);		//kreiramo njegov objekt in ga dodamo v sceno
		nasprotniki.push();						//shranimo ga v tabelo nasprotnikov
	}
	
	/**************************
		KREACIJA ASTEROIDOV
	**************************/
    var asteroids = [];
	
    asteroidMaterial = null;
    BABYLON.SceneLoader.ImportMesh("Asteroid", "obj/", "asteroid1.babylon", scene, function (m, particleSystems) {
      for (var index = 0; index < 200; index++) {
        var asteroid = m[0].createInstance("i" + index);
        asteroids.push(asteroid);

        asteroid.scaling.x*=10+Math.random()*30;
        asteroid.scaling.y*=10+Math.random()*30;
        asteroid.scaling.z*=10+Math.random()*30;
        asteroid.position.x=Math.random()*2000-1000;
        asteroid.position.y=Math.random()*2000-1000;
        asteroid.position.z=Math.random()*6500-500;
        /*asteroid.rotation.x+=Math.random()*2
        asteroid.rotation.y+=Math.random()*2*/

        if(asteroidMaterial==null){
          asteroid.material.specularTexture = new BABYLON.Texture("obj/astbump.jpg", scene);
          //asteroid.material.specularColor = new BABYLON.Color3(0.3, 0.2, 0.2);
          asteroid.material.specularPower = 2;

          asteroidMaterial = asteroid.material;
        }else asteroid.material=asteroidMaterial;


        asteroid.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:1, friction:0.5, restitution:0.5});
        asteroid.applyImpulse(new BABYLON.Vector3(Math.random()*10-5,Math.random()*10-5,Math.random()*5+5), asteroid.position);

        }
    });
	//console.log(asteroidMaterial);	//TO FAKING NE DELA KOT BI MORALO!!!! Je null

    scene.registerBeforeRender(function() {
      asteroids.forEach(function(ast){
          //ast.translate(BABYLON.Axis.X, 200, BABYLON.Space.WORLD);
        if(ast.position.z>6000){
          //console.log("translate");
          ast.setPhysicsState(BABYLON.PhysicsEngine.NoImpostor);
          ast.position.z=-500;
          //ast.setOrientation(0,0,0);
          //ast.moveWithCollisions(new BABYLON.Vector3(0,0,-500));
          //ast.translate(BABYLON.Axis.Z, -6500, BABYLON.Space.WORLD); 
          ast.updatePhysicsBodyPosition();
          //ast.translate(BABYLON.Axis.Z, -6500, BABYLON.Space.WORLD); 
          ast.refreshBoundingInfo();
          ast.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:1, friction:0.5, restitution:0.5});
          //ast.applyImpulse(new BABYLON.Vector3(Math.random()*10-5,Math.random()*10-5,Math.random()*5+5), ast.position);
        }
      });
    });
=======
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
	
    
>>>>>>> origin/master

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
		var TIME_SPENT = Math.floor((((new Date().getTime()) - TIME) / 1000));
		if(TIME_TILL_END > TIME_SPENT) {
			scene.render();
			//izrisati je treba še števec časa
		}
		//TODO else izpiši da je zmagal
		
		/*if((Math.floor(TIME_SPENT) % 60) == 0) {
			console.log(TIME_SPENT);
		}*/
	});

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		engine.resize();
	});
}

<<<<<<< HEAD
console.log("loaded main.js");
=======
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
   
>>>>>>> origin/master
