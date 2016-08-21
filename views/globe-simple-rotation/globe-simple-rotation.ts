export class GlobeSimpleRotation {
    activate() {
        (<any>window).require([
      "esri/Map",
      "esri/views/SceneView",

      "dojo/dom",
      "dojo/on",
      "dojo/domReady!"
    ], function(Map, SceneView, dom, on) {

      // Create the Map
      var map = new Map({
        basemap: "hybrid",
        ground: "world-elevation",
      });

      // Create the SceneView
      var view = new SceneView({
        map: map,
        container: "viewDiv",
        camera: {
          position: [7.654, 45.919, 5183],
          tilt: 80
        }
      });

      // Register events to control
      var rotateAntiClockwiseSpan = dom.byId("rotateAntiClockwiseSpan");
      var rotateClockwiseSpan = dom.byId("rotateClockwiseSpan");
      var indicatorSpan = dom.byId("indicatorSpan");
      on(rotateClockwiseSpan, "click", function() {
        rotateView(-1);
      });
      on(rotateAntiClockwiseSpan, "click", function() {
        rotateView(1);
      });
      on(indicatorSpan, "click", tiltView);

      // Watch the change on view.camera
      view.watch("camera", updateIndicator);

      // Create the event's callback functions
      function rotateView(direction) {
        var heading = view.camera.heading;

        // Set the heading of the view to the closest multiple of 90 degrees,
        // depending on the direction of rotation
        if (direction > 0) {
          heading = Math.floor((heading + 1e-3) / 90) * 90 + 90;
        } else {
          heading = Math.ceil((heading - 1e-3) / 90) * 90 - 90;
        }

        view.goTo({
          heading: heading
        });
      }

      function tiltView() {
        // Get the camera tilt and add a small number for numerical inaccuracies
        var tilt = view.camera.tilt + 1e-3;

        // Switch between 3 levels of tilt
        if (tilt >= 80) {
          tilt = 0;
        } else if (tilt >= 40) {
          tilt = 80;
        } else {
          tilt = 40;
        }

        view.goTo({
          tilt: tilt
        });
      }

      function updateIndicator(camera) {
        var tilt = camera.tilt;
        var heading = camera.heading;

        // Update the indicator to reflect the current tilt/heading using
        // css transforms.
        var transform = "rotateX(" + 0.8 * tilt +
          "deg) rotateY(0) rotateZ(" + -heading + "deg)";

        indicatorSpan.style["transform"] = transform;
        indicatorSpan.style["-webkit-transform"] = transform; // Solution for Safari
      }
    });

    }
}