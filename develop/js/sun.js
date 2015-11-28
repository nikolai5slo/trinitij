function Sun(camera, scene){
	
	//ustvarimo sončne žarke
	var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 80, BABYLON.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);
	
	//dodamo teksturo za sonce
	godrays.mesh.material.diffuseTexture = new BABYLON.Texture('textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
	godrays.mesh.material.diffuseTexture.hasAlpha = true;	//uporablja alfa kanal
	
	//dodamo smer žarkov (usmerjene svetlobe)
	var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
	light.parent = godrays.mesh;	//in nanjo vežemo žarke sonca
	
	//dodamo smer ambientne svetlobe sonca
	var ambiLight = new BABYLON.HemisphericLight("ambilight", new BABYLON.Vector3(0, 1, 0), scene);
	ambiLight.diffuse = new BABYLON.Color3(0.1, 0.1, 0.1);	//ta rahlo seva
	ambiLight.specular = new BABYLON.Color3(0, 0, 0);		//nima odboja svetlobe
	ambiLight.groundColor = new BABYLON.Color3(0, 0, 0);
	ambiLight.position = new BABYLON.Vector3(0,0,0);
	
	ambiLight.parent = godrays.mesh;	//ogordje sonca vsebuje ambientno svetlobo
	
	return godrays.mesh;	//vrnemo ogordje sonca
}
