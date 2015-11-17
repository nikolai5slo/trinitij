function Nasprotnik(){
	this.health = 50;			//življenja
	this.shield = 0;			//ščiti
	this.fire = true;			//strelja
	this.imortal = false;		//nesmrten
	this.friendly = false;		//prijateljsko plovilo
	this.instanca = null;	//referenca na instanco babylon objekta
	
	this.create = function(instanca, i, scene){
		BABYLON.SceneLoader.ImportMesh("Nasprotnik", "obj/", "Nasprotnik.babylon", scene, 
			function(objectMeshes){
				instanca = objectMeshes[0].createInstance("nasprotnik"+i);	//ustvari novo instanco objekta z danim id-jem
				instanca.position.x = TIRNITIJ_DEF_POS[0] + Math.pow(-1, (Math.floor(Math.random() * 2) + 1)) * (Math.random() * NASPROTNIK_START_DIST);
				instanca.position.y = TIRNITIJ_DEF_POS[1] + Math.pow(-1, (Math.floor(Math.random() * 2) + 1)) * (Math.random() * NASPROTNIK_START_DIST);
				instanca.position.z = TIRNITIJ_DEF_POS[2] + Math.pow(-1, (Math.floor(Math.random() * 2) + 1)) * (Math.random() * NASPROTNIK_START_DIST);
				
				//ker izriše in shrani še objectMeshes[0] na default poziciji (0,0,0)
				objectMeshes[0].position.x = -99999;
				objectMeshes[0].position.y = -99999;
				objectMeshes[0].position.z = -99999;
			}
		);
	}
	this.death = function(){	//ob smrti naj se pojavijo zunaj območja trinitija
		instanca.position.x = TIRNITIJ_DEF_POS[0] + Math.pow(-1, (Math.floor(Math.random() * 2) + 1)) * (Math.random() * NASPROTNIK_DEATH_DIST);
		instanca.position.y = TIRNITIJ_DEF_POS[1] + Math.pow(-1, (Math.floor(Math.random() * 2) + 1)) * (Math.random() * NASPROTNIK_DEATH_DIST);
		instanca.position.z = TIRNITIJ_DEF_POS[2] + Math.pow(-1, (Math.floor(Math.random() * 2) + 1)) * (Math.random() * NASPROTNIK_DEATH_DIST);
	}
};

console.log("loaded nasprotnik.js");
