function Player(scene){
  	var point = new BABYLON.Mesh("point", scene);
	var pickPlane = BABYLON.Mesh.CreatePlane("plane", 200.0, scene);
	pickPlane.position.z-=100;
	pickPlane.rotation.x+=Math.PI;
	pickPlane.visibility=0;

  	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
  	camera.maxZ = 30000;

	BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, function(meshes){
		var player=meshes[0];
		player.rotation.x=0;
		player.rotation.y=0;
		player.rotation.z=0;
		point.player = player;
        //player.setPhysicsState({impostor:BABYLON.PhysicsEngine.CubeImpostor, move:true, mass:1, friction:0.5, restitution:0.5});

		pickPlane.parent=player;


		camera.target = player;
		camera.radius = 30;
		//camera.heightOffset = 7;

		scene.registerBeforeRender(function() {
			//igralec.instanca.position.z+=0.5;
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