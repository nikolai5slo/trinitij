function Player(scene){
  	var point = new BABYLON.Mesh("point", scene);
	var pickPlane = BABYLON.Mesh.CreatePlane("plane", 150.0, scene);
	pickPlane.position.z-=50;
	pickPlane.rotation.x+=Math.PI;
	pickPlane.visibility=0;

  	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
  	camera.target=point;

	BABYLON.SceneLoader.ImportMesh("Igralec", "obj/", "Igralec.babylon", scene, function(meshes){
		var player=meshes[0];
		player.rotation.x=0;
		player.rotation.y=0;
		player.rotation.z=0;
        //player.setPhysicsState({impostor:BABYLON.PhysicsEngine.CubeImpostor, move:true, mass:1, friction:0.5, restitution:0.5});

		point.parent=player;
		pickPlane.parent=player;

		point.position.y+=5;
		point.position.z-=10;

		camera.target = player;
		camera.radius = 30;
		//camera.heightOffset = 7;

		scene.registerBeforeRender(function() {
			//igralec.instanca.position.z+=0.5;
			player.translate(new BABYLON.Vector3(0, 0, -3), 1, BABYLON.Space.LOCAL);
			//player.moveWithCollisions(new BABYLON.Vector3(0,0,-1.5));

          	//player.applyImpulse(new BABYLON.Vector3(0,0,0.4), new BABYLON.Vector3(0,0,0));


			var pickResult = scene.pick(scene.pointerX, scene.pointerY, function(mesh){
				return mesh == pickPlane;
			});
			if (pickResult.hit) 
				player.lookAt(pickResult.pickedPoint);
          	//player.updatePhysicsBodyPosition();
		});
	});

	return point;
}