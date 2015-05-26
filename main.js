document.addEventListener("DOMContentLoaded", function() {
    initializeThreeJS(document.body);
});

function initializeThreeJS(container) {
    // set the scene size
    var WIDTH = 500,
        HEIGHT = 500;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // create a WebGL renderer, camera
    // and a scene
    var renderer = new THREE.WebGLRenderer();
    var scene = new THREE.Scene();
    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);
    // attach the render-supplied DOM element
    container.appendChild(renderer.domElement);

	// Camera
    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 550;
    scene.add(camera);

    // Lights
    var light1 = new THREE.PointLight(0xFFFFFF);
    light1.position.z = 550;
    light1.position.x = 50;
    light1.position.y = 50;
    scene.add(light1);

    var light2 = new THREE.PointLight(0xFFFFFF);
    light2.position.z = -550;
    scene.add(light2);

    // Models
	scene.add(createFloor());
    var bike = createBike();
    scene.add(bike);

	// Controls
	var controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

    function render(timestamp) {
    	bike.spin(Math.PI/100);
        renderer.render(scene, camera);
        controls.update();
        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
}

const WHEEL_WIDTH = 2;
const BIKE_BASE = 90;
const WHEEL_RADIUS = 20;
const HANDLEBARS_ALPHA = Math.PI / 2;
const HANDLEBARS_LENGTH = .5 * WHEEL_RADIUS;

function createWheel() {
    var wheel = new THREE.Mesh(new THREE.TorusGeometry( WHEEL_RADIUS, WHEEL_WIDTH, 16, 100 ), 
        new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));

	for (var i = 0; i < 10; ++i) {
		var spoke = new THREE.Mesh(new THREE.CubeGeometry( WHEEL_RADIUS * 2, 1, 1), 
			new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));
		spoke.rotation.z = Math.PI / 10 * i;
		wheel.add(spoke);
	}
	return wheel;
}

function createHandlebars(rotationPoint) {
    var frame = new THREE.Mesh(new THREE.BoxGeometry( HANDLEBARS_LENGTH, 2, 2 ), 
        new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));
    frame.position.x = Math.cos(HANDLEBARS_ALPHA) * (WHEEL_RADIUS + HANDLEBARS_LENGTH) + rotationPoint;
    frame.position.y = Math.sin(HANDLEBARS_ALPHA) * (WHEEL_RADIUS + HANDLEBARS_LENGTH);
    frame.rotation.z = HANDLEBARS_ALPHA;

    var handles = new THREE.Mesh(new THREE.BoxGeometry( WHEEL_RADIUS, 2, 2 ), 
        new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));
    handles.position.x = HANDLEBARS_LENGTH / 2;
    handles.rotation.y = Math.PI/2;
	frame.add(handles);

    return frame;
}

function createBike() {
    var group = new THREE.Group();

	var frontWheel = createWheel();
    frontWheel.position.x = BIKE_BASE/2;
    var handles = createHandlebars(BIKE_BASE/2)
    group.add(handles);
	group.add(frontWheel);
    
	var rearWheel = createWheel();
    rearWheel.position.x = -BIKE_BASE/2;
    group.add(rearWheel);

    var frame = new THREE.Mesh(new THREE.BoxGeometry( BIKE_BASE - 2 * WHEEL_RADIUS, 2, 2 ), 
        new THREE.MeshLambertMaterial({ color: 0xCCCCCC }));
    group.add(frame);
    
    group.rotation.x = Math.PI/2;
    group.rotation.y = Math.PI/2;
    group.position.z = WHEEL_RADIUS + WHEEL_WIDTH;

    group.spin = function(alpha) {
    	frontWheel.rotation.z -= alpha;
    	frontWheel.rotation.y = Math.sin(Date.now() / 1000) * Math.PI / 5;
    	handles.rotation.y = Math.sin(Date.now() / 1000) * Math.PI / 5;
    	rearWheel.rotation.z -= alpha;
    }

    return group;
}

function createFloor() {
    var geometry = new THREE.PlaneGeometry( 1000, 1000, 32 );
    var material = new THREE.MeshLambertMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    return plane;
}