function startDemo() {

    var canvas = document.getElementById("canvas");

    var kaleidoscope = new Kaleidoscope(canvas, 600, 20, 40, 20, 10);
    kaleidoscope.render();

}