//funkcija, ki vrne naključno število med min in max
function randomNumber(min,max){
	return (Math.random()*(max-min))+min;
}

//ko se naloži celoten dokument
window.onload = function(){
	//Shranimo referenco na kanvas
	var canvas = document.querySelector("#canvas");
	
	//naložimo kanvas v babylonov izris
	var engine = new BABYLON.Engine(canvas, true);
	
	//ustvarimo sceno igre
	function createScene() {
		var scene = new BABYLON.Scene(engine);	//kreiramo sceno in jo vežemo na pogon
		
		scene.enablePhysics(new BABYLON.Vector3(0,0,0), new BABYLON.OimoJSPlugin());	//omogočimo fiziko
		
		scene.actionManager = new BABYLON.ActionManager(scene);	//ustvarimo sledilca dogodkov scene
		
		var astNest=AsteroidNest(4000, 21, scene);	//ustvarimo asteoride z obsegom in hitrostjo za sceno
		astNest.scaling.z *= 6;	//podaljšamo območe obsega asteoridov
		
		var player = new Player(2.5, scene);	//dodamo igralca v sceno z dano hitrostjo
		astNest.target = player;				//nastavimo  obseg asteoridov, da sledi točki igralca
		
		scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;	//omogočimo meglenje oddaljenih delov
		scene.fogDensity = 0.008;	//kako močno meglimo za dano razdaljo
		scene.fogStart = 800.0;		//povemo kje pričnemo megliti
		scene.fogEnd = 10000.0;		//in kod končamo (popolna zamegljenost)
		
		scene.fogColor = new BABYLON.Color3(0, 0, 0);	//megla je črne barve (vesolje)
		
		// Skybox
		var skybox = BABYLON.Mesh.CreateBox("skyBox", 15000.0, scene);	//kreiramo novo škatlo za skybox
		
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);	//ustvarimo nov skybox materijal
		skyboxMaterial.backFaceCulling = false;	//omogočimo izris zadnjih ploskev
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/sky1/sky1", scene);	//naložimo teksture
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;	//tkestura naj upošteva da gre za skybox
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);	//vesolje je temno
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);	//ni odseva
		skyboxMaterial.disableLighting = true;	//onemogočimo svetlobo
		skybox.infiniteDistance = true;			//igralec se ozadju ne more približati
		skybox.renderingGroupId = 0;			//naj se prvo zrenderira
		
		skybox.material = skyboxMaterial;	//dodamo materijal škatli skyboxa
		
		var sun = new Sun(scene.activeCamera, scene);			//ustvarimo sonce (kamera za žarke)
		sun.position = new BABYLON.Vector3(-2000, 50, 2000);	//postavimo sonce na svojo pozicijo
		sun.scaling = new BABYLON.Vector3(200, 200, 200);		//prilagodimo velikost sonca
		
		var earth = new Earth(5500.0, scene);	//ustvarimo zemljo, dane velikosti, za sceno
		earth.position = new BABYLON.Vector3(5000,-400,6000);	//in jo ustrezno pozicioniramo
		
		skybox.parent = player.ship;							//skybox potuje z ladjo igralca
		sun.parent = player.ship;								//sonce potuje z ladjo igralca
		
		scene.registerBeforeRender(function() {					//pred vsakim izrisom
			var tekst = document.getElementById("overText");	//referenca na element tekst napisa
			var score = document.getElementById("score").innerHTML.split(" ");	//točke igralca
			var end_game = false;	//ali končamo igro
			
			if(parseInt(score[1]) >= 1500){	//če je igralec zbral dovolj točk
				tekst.innerHTML = "YOU WON<br>NEXT STOP TRINITJ";	//dodamo ustrezen napis
				end_game = true;	//igra se bo končala
			}
			
			if(!end_game){											//če se igra ne bo končala
				astNest.asteroids.forEach(function(ast){			//za vsak asteorid
					if(player.ship.intersectsMesh(ast, true)){		//kličemo preverjanje prekrivanj s ladje s asteroidom
						tekst.innerHTML = "GAME OVER";	//dodamo ustrezen napis
						end_game = true;	//igra se bo končala
					}
				});
			}
			
			if(end_game){						//če se igra konča
				engine.stopRenderLoop();		//ustavimo izris
				tekst.style.display = "block";	//in ga naredimo vidljivega
			}
		});
	
		return scene;	// vrnemo ustvarjeno sceno
	};
	
	// ustvarimo sceno
	var scene = createScene();
	
	//pogonu povemo naj izrisuje našo sceno
	engine.runRenderLoop(function () {
		scene.render();
	});
	
	//dodamo poslušalca za spremembo velikosti okna
	window.addEventListener("resize", function () {
		engine.resize();	//ustrezno prilagodimo izris
	});
}
