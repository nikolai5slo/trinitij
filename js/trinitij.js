function Trinitij(){
	this.health = 200;			//življenja
	this.shield = 200;			//ščiti
	this.fire = false;			//strelja
	this.imortal = true;		//nesmrten
	this.friendly = true;		//prijateljsko plovilo
	this.instanca = null;	//referenca na instanco babylon objekta
	
	this.create = function(instanca, scene){
		BABYLON.SceneLoader.ImportMesh("Trinitj", "obj/", "Trinitij.babylon", scene, 
			function(objectMeshes){
				instanca = objectMeshes[0].createInstance("trinitij");	//ustvari novo instanco objekta z danim id-jem
				instanca.position.x = TIRNITIJ_DEF_POS[0];
				instanca.position.y = TIRNITIJ_DEF_POS[1];
				instanca.position.z = TIRNITIJ_DEF_POS[2];
			}
		);
	}
};

console.log("loaded trinitij.js");
