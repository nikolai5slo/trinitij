function Earth(size, scene){
	//materijal
	var earthMaterial = new BABYLON.StandardMaterial("earth", scene);	//ustvarimo materijal za zemljo
	earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth1.jpg", scene);			//difuzna
	earthMaterial.specularTexture = new BABYLON.Texture("textures/earthspec2.jpg", scene);		//odbojna
	earthMaterial.emissiveTexture = new BABYLON.Texture("textures/earthlights2.jpg", scene);	//odsevna
	earthMaterial.specularPower = 100;	//moč odboja
	
	//ogrodje
	var earth = BABYLON.Mesh.CreateSphere("sphere", 100.0, size, scene);	//zemlja je krogla
	earth.material = earthMaterial;	//dodamo materijal zanjo
	earth.rotation.x = Math.PI;		//jo obrnemo za 180°
	
	//Rotacija
	scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, earth, "rotation.y", 0.0002));	//ji nastavimo konstantno rotacijo

	//Atmosfera
	var atmosphere = BABYLON.Mesh.CreateSphere("atmosphere", 100.0, size + size * 0.005, scene);
	atmosphere.parent = earth;		//vežemo atmosfero na zemljo
	earth.atmosphere = atmosphere;	//in jo shranimo
	var atmosphereMaterial = new BABYLON.StandardMaterial("atmosphereMat", scene);	//ustvarimo material za atmosfero
	atmosphereMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 1);		//dizuna je bolj modra
	atmosphereMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.6);	//enako za odbojno
	atmosphereMaterial.alpha = 0.1;				//atmosfera je komaj vidna
	atmosphereMaterial.specularPower = 2;		//in nima močnega odseva
	atmosphere.material = atmosphereMaterial;	//nastavimo materijal atmosferi
	
	//vidljivost zemlje glede na kot
	atmosphereMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
	atmosphereMaterial.opacityFresnelParameters.bias = 0.4;
	atmosphereMaterial.opacityFresnelParameters.power = 1;	//malo
	atmosphereMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();	//zatemnimo robove
	atmosphereMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();	//osvetlimo vidnost centra

	return earth;
}