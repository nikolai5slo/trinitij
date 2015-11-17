function Igralec(){
	this.health = 100;			//življenja igralca
	this.shield = 100;			//ščiti igralca
	this.fire = true;			//igralec lahko strelja
	this.imortal = false;		//ni nesmrten
	this.friendly = true;		//ne gre za sovražno plovilo
	this.instanca = null;		//referenca na instanco babylon objekta
	
	this.create = function(instanca, scene){
		BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, 
			function(objectMeshes){
				instanca = objectMeshes[0].createInstance("igralec");	//ustvari novo instanco objekta z danim id-jem
			}
		);
	}
};

console.log("loaded igralec.js");
