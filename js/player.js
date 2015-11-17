function Player(scene){
  	var point = new BABYLON.Mesh("point", scene);
	var pickPlane = BABYLON.Mesh.CreatePlane("plane", 200.0, scene);
	pickPlane.position.z-=100;
	pickPlane.rotation.x+=Math.PI;
	pickPlane.visibility=0;

  	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);

	//var scorePlane = BABYLON.Mesh.CreatePlane("planescore", 5.0, scene);
	//scorePlane.material = new BABYLON.StandardMaterial("background", scene);
	//scorePlane.material.disableLighting = true;
	//scorePlane.material.diffuseColor = new BABYLON.Color3(1, 1,1);
	//scorePlane.rotation.y = Math.PI;
	//scorePlane.rotation.x = Math.PI/2;
	//scorePlane.rotation.z = Math.PI*1.5;
	//var backgroundTexture2 = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
	//scorePlane.material.reflectionTexture = backgroundTexture2;

	//scorePlane.material.emissiveColor = new BABYLON.Vector3(1,1,1);

	var socre=document.getElementById("score");

  	camera.maxZ = 30000;

	BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, function(meshes){
		var player=meshes[0];
		player.rotation.x=0;
		player.rotation.y=Math.PI;
		player.rotation.z=0;
		point.ship = player;
        //player.setPhysicsState({impostor:BABYLON.PhysicsEngine.CubeImpostor, move:true, mass:1, friction:0.5, restitution:0.5});

		pickPlane.parent=player;
/*
		scorePlane.position.x-=11;
		scorePlane.position.y-=2;
		//scorePlane.rotation.x=Math.PI;
		scorePlane.rotation.y=Math.PI;
		scorePlane.parent=player;
		*/


		camera.target = player;
		camera.radius = 30;
		//camera.heightOffset = 7;

		scene.registerBeforeRender(function() {
			//igralec.instanca.position.z+=0.5;
			//backgroundTexture2.drawText(""+Math.round(player.position.z/10), null, 350, "bold 205px Segoe UI", "white", "#555555");

          	score.innerHTML="Score:"+Math.round(player.position.z/10);
			player.translate(new BABYLON.Vector3(0, 0, -2.5), 1, BABYLON.Space.LOCAL);
			//player.translate(new BABYLON.Vector3(0, 0, -3), 1, BABYLON.Space.WORLD);
			//player.moveWithCollisions(new BABYLON.Vector3(0,0,-1.5));

          	//player.applyImpulse(new BABYLON.Vector3(0,0,0.4), new BABYLON.Vector3(0,0,0));


			var pickResult = scene.pick(scene.pointerX, scene.pointerY, function(mesh){
				return mesh == pickPlane;
			});
			if (pickResult.hit) 
				player.lookAt(pickResult.pickedPoint);
          	//player.updatePhysicsBodyPosition();
	        //player.refreshBoundingInfo();
			point.position=player.getPositionExpressedInLocalSpace();
		});
	});

	return point;
}