var camera, scene, renderer;
var root;
var controls;

init();

function init(){
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 400;
	
	scene = new THREE.Scene();
	
	root = new THREE.Object3D();
	scene.add( root );
	
	//
	
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
	renderer.setClearColor( 0xff0000, 0 ); // the default
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	//

	controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.rotateSpeed = 0.5;

}


window.addEventListener('resize', function () {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});


var thingy = 0;
// instantiate the loader
var loader = new THREE.OBJLoader2();
var loadedObject;

// function called on successful load
var callbackOnLoad = function ( event ) {
	
	scene.add( event.detail.loaderRootNode );
	loadedObject = event.detail.loaderRootNode;
};

loader.setModelName ('boom');

// load a resource from provided URL synchronously
loader.load( 'media/arbre-magique.obj', callbackOnLoad, null, null, null, false );

//ambient light
  var ambient = new THREE.AmbientLight(0xbbbbbb);
  scene.add(ambient);

//directional licht
var directionalLight = new THREE.DirectionalLight(0xdddddd);
  directionalLight.position.set(0, 0, 2);
  scene.add(directionalLight);

//create shapes
var geomertry = new THREE.BoxGeometry(10, 10, 10);

var cubeMaterials = [
	new THREE.MeshBasicMaterial({	map: new THREE.TextureLoader().load('media/1.jpg'),	side: THREE.DoubleSide }), //RIGHT SIDE
	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('media/2.png'), side: THREE.DoubleSide }), // LEFT SIDE
	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('media/1.jpg'), side: THREE.DoubleSide }), // TOP SIDE
	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('media/2.png'), side: THREE.DoubleSide }), //BOTTOM SIDE
	new THREE.MeshBasicMaterial({	map: new THREE.TextureLoader().load('media/1.jpg'), side: THREE.DoubleSide }), //FRONT SIDE
	new THREE.MeshBasicMaterial({ color: 0xFFFFCC, side: THREE.DoubleSide }), //BACK SIDE
];

//create material or texuture
var material = new THREE.MeshFaceMaterial( cubeMaterials );

var materialBasic = new THREE.MeshBasicMaterial({
	color: 0xCCFFFF,
	wireframe: false
});
var cube = new THREE.Mesh(geomertry, material);
scene.add(cube);

camera.position.z = 30;
camera.position.x = 50;


//game logic
var update = function () {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.005;
	//_MeshBody1.rotation.y += 1;
	if (loadedObject) loadedObject.rotation.y += .1;
};

//draw scene
var render = function () {
	renderer.render(scene, camera);	
};


//run gameloop (update, render, repeat)
var gameloop = function () {
	requestAnimationFrame(gameloop);
	update();
	render();
};

gameloop();
