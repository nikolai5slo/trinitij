function Earth(size, scene){
	// Create earth
	var earthMaterial = new BABYLON.StandardMaterial("earth", scene);
	//var earthMaterial = new BABYLON.CubeTexture("earth", scene);
	earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth1.jpg", scene);
	//earthMaterial.bumpTexture = new BABYLON.Texture("textures/earthbump.jpg", scene);
	earthMaterial.specularTexture = new BABYLON.Texture("textures/earthspec2.jpg", scene);
	earthMaterial.emissiveTexture = new BABYLON.Texture("textures/earthlights2.jpg", scene);
	earthMaterial.specularPower = 100; 


	var earth = BABYLON.Mesh.CreateSphere("sphere", 100.0, size, scene);
	earth.material=earthMaterial;
	earth.rotation.x=Math.PI;

	// Earth rotation
	scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, earth, "rotation.y", 0.0002));

	// Atmosphere
	var atmosphere = BABYLON.Mesh.CreateSphere("atmosphere", 100.0, size + size*0.005, scene);
	atmosphere.parent=earth;
	earth.atmosphere=atmosphere;
	var atmosphereMaterial = new BABYLON.StandardMaterial("atmosphere", scene);
	atmosphereMaterial.diffuseColor = new BABYLON.Color3(0.4,0.4,1);
	//atmosphereMaterial.emissiveColor = new BABYLON.Color3(0,0,0.3);
	//atmosphereMaterial.ambientColor = new BABYLON.Color3(0,0,1);
	atmosphereMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.6);
	atmosphereMaterial.alpha = 0.1;
	atmosphereMaterial.specularPower = 2;
	atmosphere.material = atmosphereMaterial;

	atmosphereMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
	atmosphereMaterial.opacityFresnelParameters.bias = 0.4;
	atmosphereMaterial.opacityFresnelParameters.power = 1;
	atmosphereMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
	atmosphereMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();

	return earth;
}