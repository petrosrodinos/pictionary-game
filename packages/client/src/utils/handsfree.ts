// import Handsfree from "handsfree";
// import "@tensorflow/tfjs-backend-cpu";

// try {
//   const handsfree = new Handsfree({ weboji: true });
//   handsfree.enablePlugins("browser");

//   // Now let's start things up
//   handsfree.start();

//   // Let's create a plugin called "logger"
//   // - Plugins run on every frame and is how you "plug in" to the main loop
//   // - "this" context is the plugin itself. In this case, handsfree.plugin.logger
//   handsfree.use("logger", (data: any) => {
//     console.log(data.weboji.morphs, data.weboji.rotation, data.weboji.pointer, data, this);
//   });

//   // Let's switch to hand tracking now. To demonstrate that you can do this live,
//   // let's create a plugin that switches to hand tracking when both eyebrows go up
//   handsfree.use("handTrackingSwitcher", ({ weboji }: any) => {
//     if (weboji.state.browsUp) {
//       // Disable this plugin
//       // Same as handsfree.plugin.handTrackingSwitcher.disable()
//       handsfree.disable();

//       // Turn off face tracking and enable hand tracking
//       handsfree.update({
//         weboji: false,
//         hands: true,
//       });
//     }
//   });
// } catch (e: any) {
//   console.log(e);
// }
