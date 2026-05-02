import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseComponent
} from "./chunk-CHOMUP36.js";
import {
  s2 as s
} from "./chunk-6MXC75VH.js";
import {
  Directive,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵdefineDirective,
  ɵɵgetInheritedFactory
} from "./chunk-32GIQMO2.js";
import {
  computed,
  signal
} from "./chunk-GPAMLMSK.js";

// node_modules/primeng/fesm2022/primeng-basemodelholder.mjs
var BaseModelHolder = class _BaseModelHolder extends BaseComponent {
  modelValue = signal(void 0, ...ngDevMode ? [{
    debugName: "modelValue"
  }] : (
    /* istanbul ignore next */
    []
  ));
  $filled = computed(() => s(this.modelValue()), ...ngDevMode ? [{
    debugName: "$filled"
  }] : (
    /* istanbul ignore next */
    []
  ));
  writeModelValue(value) {
    this.modelValue.set(value);
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBaseModelHolder_BaseFactory;
    return function BaseModelHolder_Factory(__ngFactoryType__) {
      return (ɵBaseModelHolder_BaseFactory || (ɵBaseModelHolder_BaseFactory = ɵɵgetInheritedFactory(_BaseModelHolder)))(__ngFactoryType__ || _BaseModelHolder);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _BaseModelHolder,
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseModelHolder, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, null);
})();

export {
  BaseModelHolder
};
//# sourceMappingURL=chunk-6FJOSO4T.js.map
