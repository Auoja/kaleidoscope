function startDemo() {

    var canvas = document.getElementById("canvas");

    var kaleidoscope = new Kaleidoscope(canvas, 600, 10, 40, 20, 10);
    kaleidoscope.render();

}