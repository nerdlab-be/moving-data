var camera, scene, renderer;
var root;
var data;
// var controls;

// Just animate currentFrame values to animate the camera:
// For example: tweening from 2 to 3 moves the camera between those two pictures
var currentFrame = 0;
var frame0Pos;
var picScale = 3.0;

window.onload = function() {
	var dataFile = window.location.search ? window.location.search.slice(1) : 'cats.json';
	loadData(dataFile);
}

function loadData(dataFile)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = JSON.parse(this.responseText);
				init();
			}
	};

	// TODO: Replace back with something formatted like data.json
	xhttp.open("GET", dataFile, true);
	xhttp.send();
}

function init(){
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	scene = new THREE.Scene();
	
	root = new THREE.Object3D();
	scene.add( root );

	var geometry = new THREE.PlaneBufferGeometry( 1 * picScale , 0.75 * picScale);
	
	var loader = new THREE.TextureLoader();
	loader.setCrossOrigin("*");

	var t = 0.0;
	var prev = null;

	for (var i = 0; i < data.collection.length ;i++){	
		var item = data.collection[i];
		item.photoURL = item.photoURL ||  "https://picsum.photos/200/300/?random&rnd=" + Math.random();
		item.coords = [
			(Math.sin(Math.sin(t)) * Math.cos(t * .001)) * 50,
			Math.sin(t * .5) * Math.cos(t * .01) * 5,
			Math.cos(t * .1) * (Math.sin(t * .33) * .5 + .5) * 50
		];
		console.log(item.coords)
		var texture = loader.load(item.photoURL);
		texture.minFilter = THREE.LinearFilter;	// cannot use mipmapping on non-POT textures
		var material = new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.DoubleSide
			});

		var plane = new THREE.Mesh( geometry, material);
		var coord = item.coords;
		plane.position.set(coord[0], coord[1], coord[2]);
		scene.add( plane );

		if (i >= 1)
			plane.lookAt(prev.position);
		if (i === 1) {
			// still need to orient the first pic and the camera looking at it

			// orient first plane in the same way as the second
			prev.quaternion.copy(plane.quaternion);
			// orient camera in the same way as the first plane, so it looks head-on
			camera.quaternion.copy(plane.quaternion);
			camera.updateMatrixWorld();

			// "1m behind", according to the camera orientation
			var offset = new THREE.Vector3(0, 0, 1);
			offset.applyMatrix4(camera.matrixWorld);
			camera.position.addVectors(prev.position, offset);
			frame0Pos = camera.position;
		}

		prev = plane;

		t += .3;
	}
	window.LOLCATS = data;


	//
	
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
	renderer.setClearColor( 0xff0000, 0 ); // the default
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	//

	// controls = new THREE.OrbitControls(camera, renderer.domElement)
	// controls.rotateSpeed = 0.5;

	window.addEventListener('resize', onResize);
	onResize();
	gameloop();
}

function onResize()
{
	var width = window.innerWidth;	
	var height = window.innerHeight;
	renderer.setSize(width, height);

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}


//game logic
function update() {
	currentFrame += .02;

	var t = Math.min(currentFrame, data.collection.length - 0.001);
	var i1 = Math.floor(t);
	var i0 = i1 - 1;
	var i2 = i1 + 1;

	// this is the lookat target
	// the camera itself will follow behind 1 frame
	var frameA = data.collection[i1];
	var frameB = data.collection[i2];
	var fr = currentFrame - i1;
	var pos0;

	if (i0 < 0) {
		pos0 = frame0Pos;
	}
	else {
		var frame0 = data.collection[i0];
		pos0 = new THREE.Vector3(frame0.coords[0], frame0.coords[1], frame0.coords[2]);
	}


	var posA = new THREE.Vector3(frameA.coords[0], frameA.coords[1], frameA.coords[2]);
	var posB = new THREE.Vector3(frameB.coords[0], frameB.coords[1], frameB.coords[2]);

	// put camera between pos0 and posA (so 1 frame behind lookat)
	pos0.lerp(posA, fr);
	// put the look-at camera between posA and posB
	posA.lerp(posB, fr);

	camera.position.copy(pos0);
	camera.position.y += .5 * picScale;
	camera.lookAt(posA);
}

//draw scene
function render() {
	renderer.render(scene, camera);	
}


//run gameloop (update, render, repeat)
function gameloop() {
	requestAnimationFrame(gameloop);
	update();
	render();
}