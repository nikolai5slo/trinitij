function AsteoridNest(scene){
    var bBox= BABYLON.Mesh.CreateBox("bBox", 700, scene);
    bBox.visibility=0;

    var vecWorld = bBox.getBoundingInfo().boundingBox.vectorsWorld;

    var minEmitBox=vecWorld[0];
    var maxEmitBox=vecWorld[1];


	// Create asteorid mist with particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 30000, scene);

    bBox.position.y=0;
    bBox.position.x=0;
    bBox.position.z=0;

    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
    particleSystem.emitRate = 1000;
    particleSystem.emitter = bBox;
    //particleSystem.minEmitBox = new BABYLON.Vector3(700, -700, 700); // Starting all From
    particleSystem.minEmitBox = minEmitBox; 
    //particleSystem.maxEmitBox = new BABYLON.Vector3(-700, 700, -700); // To...
    particleSystem.maxEmitBox = maxEmitBox;
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
    ///////////////////////////////////////////////////




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

    // custom vertex function for transformation
    var myVertexFunction = function(particle, vertex, i) {
      vertex.x *= (Math.random() + 1);
      vertex.y *= (Math.random() + 1);
      vertex.z *= (Math.random() + 1);
    };

    // Create solid particle system
    var SPS = new BABYLON.SolidParticleSystem('SPS', scene, {updatable: false});

    // Create object for asteroids
    var sphere = BABYLON.MeshBuilder.CreateSphere("s", {diameter: 6, segments: 3}, scene);
    // Add objects to SPS and transform it with myVertexFunction
    SPS.addShape(sphere, 500, {vertexFunction: myVertexFunction});
    var mesh = SPS.buildMesh();
    mesh.position.z=0;
    mesh.material = mat;
    // dispose object
    sphere.dispose();


    SPS.initParticles = function() {
      // just recycle everything
      for (var p = 0; p < this.nbParticles; p++) {
        this.recycleParticle(this.particles[p]);


        this.particles[p].position.x = randomNumber(minEmitBox.x, maxEmitBox.x);
        this.particles[p].position.y = randomNumber(minEmitBox.y, maxEmitBox.y);
        this.particles[p].position.z = randomNumber(minEmitBox.z, maxEmitBox.z);
    	
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

	  particle.position.x = randomNumber(minEmitBox.x, maxEmitBox.x);
      particle.position.y = randomNumber(minEmitBox.y, maxEmitBox.y);
      particle.position.z = minEmitBox.z;


      particle.rotation.x = Math.random() * 3.5;
      particle.rotation.y = Math.random() * 3.5;
      particle.rotation.z = Math.random() * 3.5;


      grey = 1.0 - Math.random() * 0.3;
      particle.color = new BABYLON.Color4(grey, grey, grey, 1);

      particle.velocity.z =  Math.random() * 2;
      //particle.velocity.x =  Math.random()/2 - 0.25;
      //particle.velocity.y =  Math.random()/2 - 0.25;
    };


    // update : will be called by setParticles()
    SPS.updateParticle = function(particle) {  
      // some physics here 
      if (particle.position.z > maxEmitBox.z) {
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




    // Load asteroids from file with physics
    var asteroids= [];
	
    asteroidMaterial = null;
    BABYLON.SceneLoader.ImportMesh("Asteroid", "obj/", "asteroid1.babylon", scene, function (m, particleSystems) {
      for (var index = 0; index < 100; index++) {
        var asteroid = m[0].createInstance("i" + index);
        asteroids.push(asteroid);

        asteroid.scaling.x*=10+Math.random()*30;
        asteroid.scaling.y*=10+Math.random()*30;
        asteroid.scaling.z*=10+Math.random()*30;

        asteroid.position.x = randomNumber(particleSystem.minEmitBox.x, particleSystem.maxEmitBox.x);
      	asteroid.position.y = randomNumber(particleSystem.minEmitBox.y, particleSystem.maxEmitBox.y);
      	asteroid.position.z = randomNumber(particleSystem.minEmitBox.z, particleSystem.maxEmitBox.z);

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

    scene.registerBeforeRender(function() {
      asteroids.forEach(function(ast){
        if(ast.position.z > maxEmitBox.z){
          ast.setPhysicsState(BABYLON.PhysicsEngine.NoImpostor);
          ast.position.z = minEmitBox.z;
          ast.updatePhysicsBodyPosition();
          ast.refreshBoundingInfo();
          ast.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:1, friction:0.5, restitution:0.5});
          //ast.applyImpulse(new BABYLON.Vector3(Math.random()*10-5,Math.random()*10-5,Math.random()*5+5), ast.position);
        }
      });
    });


}

/*
function AsteoridLoader(scene){		//razred, ki naloži potrebne elemente razreda Asteroid
	this.mesh = null;				//ogrodje objekta, ki je enako vsem (da se samo 1x naloži)
	this.material = null;			//material, ki je enak vsem (da se samo 1x naloži)
	
	//preberemo in shranimo ogrodje
	this.initializeLoader() = function(mesh, material){
		BABYLON.SceneLoader.ImportMesh("Asteroid", "obj/", "asteroid1.babylon", scene, function(objectMesh, particleSystems){
			mesh = objectMesh[0];			//naložimo mesh
			console.log(mesh);
			material = new BABYLON.StandardMaterial("asteroid_material", scene);	//naložimo materjal
			material.specularTexture = new BABYLON.Texture("obj/astbump.jpg", scene);	//dodamo teksturo
			material.specularPower = 2;	//nastavimo moč osvatlitve
		});
	}
};

function Asteroid(){										//razred Asteroid
	this.incstanca = null;									//referenca na instanco babylon objekta
	
	this.createAsteroid = function (loader, index, instanca){	//metoda, ki ustvari nov objekt
		incstanca = loader.mesh.createInstance("aster" + index);	//ustvari novo instanco objekta z danim id-jem
		incstanca.material = loader.material;

		incstanca.scaling.x *= 1 + Math.random() * 2;		//nastavi naključno velikost
		incstanca.scaling.y *= 1 + Math.random() * 2;
		incstanca.scaling.z *= 1 + Math.random() * 2;
		incstanca.position.x = Math.random() * 200 - 100;	//nastavi naključno pozicijo
		incstanca.position.y = Math.random() * 200 - 100;
		incstanca.position.z = Math.random() * 1200 - 500;
		incstanca.rotation.x += Math.random() * 2;			//nastavi naključni kot rotacije
		incstanca.rotation.y += Math.random() * 2;
		
		incstanca.setPhysicsState({							//nastavimo fiziko
			impostor: BABYLON.PhysicsEngine.SphereImpostor,
			move: true,
			mass: 1.5,
			friction: 0.5, 
			restitution: 0.5
		});
		incstanca.applyImpulse(								//dodamo začetni impulz (gibanje)
			new BABYLON.Vector3(							//z določeno smerjo
				Math.random() * 10 - 5,
				Math.random() * 10 - 5,
				Math.random() * 5 + 5
			), incstanca.position							//glede na pozicijo objekta
		);
	}
};
*/