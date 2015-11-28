function Player(speed, scene){
  	var point = new BABYLON.Mesh("point", scene);						//igralec je točka
	var pickPlane = BABYLON.Mesh.CreatePlane("plane", 200.0, scene);	//in ima svojo planjavo za sledenje miške
	pickPlane.position.z -= 100;		//planjava naj bo pred igralcem
	pickPlane.rotation.x += Math.PI;	//in naj bo obrnjena proti njemu
	pickPlane.visibility = 0;			//igralec naj je ne vidi
	
	//kamera igralca, ki sledi igralcu
  	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
	
	var score = document.getElementById("score");	//točke igralca
	
  	camera.maxZ = 30000;	//maksimalna globina pogleda kamere
	
	//naložimo ladjo igralca in hkrati ustvarimo njegovo odzivnost
	BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, function(meshes){
		var player = meshes[0];			//ladja igralca
		//player.rotation.x = 0;			//reset x rotacije
		player.rotation.y = Math.PI;	//obrnemo ladjo za 180°
		//player.rotation.z = 0;			//reset z roaticje
		point.ship = player;			//shranimo ladjo igralca
		
		pickPlane.parent = player;		//nastavimo, da je ladja starš planjave
		
		camera.target = player;			//da kamera sledi ladji igralca
		camera.radius = 30;				//z razdalje 30
		
		//definiramo, kaj se zgodi vsak frame pred izrisom
		scene.registerBeforeRender(function(){
          	score.innerHTML = "Score: " + Math.round(player.position.z/10);	//posodobimo točke igralca
			player.translate(new BABYLON.Vector3(0, 0, -speed), 1, BABYLON.Space.LOCAL);	//ladjo igralca premaknemo "naprej" za določeno hitrost
			
			//naredimo raytrace za planjavo in poberemo koordinate miške
			var pickResult = scene.pick(scene.pointerX, scene.pointerY, function(mesh){
				return mesh == pickPlane;	//povemo ali je šlo za planjavo
			});
			
			//če smo zadeli planjavo potem
			if (pickResult.hit){
				player.lookAt(pickResult.pickedPoint);	//usmerimo ladjo igralca kamor je kazala miška
			}
			
			point.position = player.getPositionExpressedInLocalSpace();	//na kocu posodobimo pozicijo točke, glede na lokalne koordinate ladje igralca
		});
	});

	return point;	//vrnemo ustvarjenega igralca kot točko
}