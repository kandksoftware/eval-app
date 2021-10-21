window.addEventListener('load', () => {
  const __PATH = 'js/'
  
  new ScriptLoader([
    /* libraries */
    __PATH + 'lib/observer.js',
    __PATH + 'lib/ea.js',
    __PATH + 'lib/math-array.js',
    __PATH + 'lib/timer.js',
    /* app settings */
    __PATH + 'settings/config.js',
    /* system */
    __PATH + 'system/app.js',
    __PATH + 'system/component.js',
    /* src */
    __PATH + 'src/global-functions.js',
    __PATH + 'src/caret.js',
    __PATH + 'src/autocomplete.js',
    /* src / interpreter start */
    __PATH + 'src/engine/fake-thread.js',
    __PATH + 'src/engine/marker.js',
    __PATH + 'src/engine/interpreter/path.js',
    __PATH + 'src/engine/interpreter/validator.js',
    __PATH + 'src/engine/interpreter/limiter.js',
    __PATH + 'src/engine/interpreter/variables.js',
    __PATH + 'src/engine/interpreter/build-in-functions.js',
    __PATH + 'src/engine/interpreter/parser.js',
    __PATH + 'src/engine/interpreter/var.js',
    __PATH + 'src/engine/interpreter/use.js',
    __PATH + 'src/engine/interpreter/print.js',
    __PATH + 'src/engine/interpreter/show.js',
    __PATH + 'src/engine/interpreter/close.js',
    __PATH + 'src/engine/interpreter/interpreter.js',
    __PATH + 'src/engine/interpreter/runner.js',
    /* src / interpreter end */
    __PATH + 'src/result-collector.js',
    __PATH + 'src/engine/calculator.js',
    __PATH + 'src/model/models.js',
    __PATH + 'src/backup.js',
    __PATH + 'src/io.js',
    /* modules */
    /* parents modules */
    __PATH + 'modules/super/super-component.js',
    /* eval */
    __PATH + 'modules/eval/component.js',
    __PATH + 'modules/eval/controller.js',
    /* add */
    __PATH + 'modules/add/component.js',
    __PATH + 'modules/add/controller.js',
    /* notification */
    __PATH + 'modules/notification/component.js',
    __PATH + 'modules/notification/controller.js',
    /* menu */
    __PATH + 'modules/menu/component.js',
    __PATH + 'modules/menu/controller.js',
    /* settings */
    __PATH + 'modules/settings/component.js',
    __PATH + 'modules/settings/controller.js',
    /* file */
    __PATH + 'modules/file/component.js',
    __PATH + 'modules/file/controller.js',
    /* autocomplete */
    __PATH + 'modules/autocomplete/component.js',
    __PATH + 'modules/autocomplete/controller.js',
    /* main (run here everything) */
    __PATH + 'main.js',
  ]).exec(() => main())
})

