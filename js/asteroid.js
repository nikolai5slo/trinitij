function AsteoridLoader(){		//razred, ki naloži potrebne elemente razreda Asteroid
	this.mesh = null;			//ogrodje objekta, ki je enako vsem (da se samo 1x naloži)
	this.material = null;		//material, ki je enak vsem (da se samo 1x naloži)
	
	//preberemo in shranimo ogrodje
	this.initializeLoader() = function(mesh, material, scene){
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

console.log("loaded asteroid.js");