function Igralec(){
	this.health = 100;			//življenja igralca
	this.shield = 100;			//ščiti igralca
	this.fire = true;			//igralec lahko strelja
	this.imortal = false;		//ni nesmrten
	this.friendly = true;		//ne gre za sovražno plovilo
	this.instanca = null;		//referenca na instanco babylon objekta
	
	this.create = function(instanca, scene, camera){
		BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, 
			function(objectMeshes){
				instanca = objectMeshes[0].createInstance("igralec");	//ustvari novo instanco objekta z danim id-jem
				camera.target = instanca;	//nastavimo kamero, da sledi igralcu
				
				//ker izriše in shrani še objectMeshes[0] na default poziciji (0,0,0)
				objectMeshes[0].position.x = -99999;
				objectMeshes[0].position.y = -99999;
				objectMeshes[0].position.z = -99999;
			}
		);
	}
};

console.log("loaded igralec.js");
