import './polyfills.server.mjs';
import{a as me}from"./chunk-3VAVYX6N.mjs";import{a as ge,d as ke,t as xe}from"./chunk-3UTULHGG.mjs";import{$ as le,M as ae,N as se,X as de,aa as I,ca as ue,ea as he,la as k,ma as pe,qa as be}from"./chunk-U6XJYDVN.mjs";import{Ac as ce,Bb as F,E as b,Ea as s,Fa as E,Fc as fe,G as $,Ga as T,Ha as C,I as S,J as x,Jb as g,Ka as K,Kb as te,La as B,M as D,Ma as V,N as H,P as m,Qa as X,Ra as p,Ua as Y,Va as W,Wa as _,Wb as ne,Xa as w,Yb as oe,_b as ie,a as q,ba as d,bc as re,cb as Z,d as z,db as u,ka as v,la as Q,nb as J,oa as G,oc as R,pa as y,q as A,qa as f,rb as ee,t as P,u as h,v as L,w as U,xa as l,y as a,yb as N,zb as j}from"./chunk-PYBKU4FO.mjs";function Je(t){t||(t=a(S));let i=new q(e=>{if(t.destroyed){e.next();return}return t.onDestroy(e.next.bind(e))});return e=>e.pipe(A(i))}function et(t,i){let e=i?.injector??a($),o=new z(1),n=H(()=>{let r;try{r=t()}catch(c){N(()=>o.error(c));return}N(()=>o.next(r))},{injector:e,manualCleanup:!0});return e.get(S).onDestroy(()=>{n.destroy(),o.complete()}),o.asObservable()}var Me=["data-p-icon","minus"],ve=(()=>{class t extends be{static \u0275fac=(()=>{let e;return function(n){return(e||(e=m(t)))(n||t)}})();static \u0275cmp=v({type:t,selectors:[["","data-p-icon","minus"]],features:[y],attrs:Me,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(o,n){o&1&&(b(),K(0,"path",0))},encapsulation:2})}return t})();var ye=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var Se=["icon"],De=["input"],Ee=(t,i,e)=>({checked:t,class:i,dataP:e});function Te(t,i){if(t&1&&C(0,"span",8),t&2){let e=p(3);u(e.cx("icon")),s("ngClass",e.checkboxIcon)("pBind",e.ptm("icon")),l("data-p",e.dataP)}}function Be(t,i){if(t&1&&(b(),C(0,"svg",9)),t&2){let e=p(3);u(e.cx("icon")),s("pBind",e.ptm("icon")),l("data-p",e.dataP)}}function Ve(t,i){if(t&1&&(B(0),f(1,Te,1,5,"span",6)(2,Be,1,4,"svg",7),V()),t&2){let e=p(2);d(),s("ngIf",e.checkboxIcon),d(),s("ngIf",!e.checkboxIcon)}}function Ne(t,i){if(t&1&&(b(),C(0,"svg",10)),t&2){let e=p(2);u(e.cx("icon")),s("pBind",e.ptm("icon")),l("data-p",e.dataP)}}function je(t,i){if(t&1&&(B(0),f(1,Ve,3,2,"ng-container",3)(2,Ne,1,4,"svg",5),V()),t&2){let e=p();d(),s("ngIf",e.checked),d(),s("ngIf",e._indeterminate())}}function Fe(t,i){}function Re(t,i){t&1&&f(0,Fe,0,0,"ng-template")}var Oe=`
    ${ye}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,qe={root:({instance:t})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":t.checked,"p-disabled":t.$disabled(),"p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-checkbox-sm p-inputfield-sm":t.size()==="small","p-checkbox-lg p-inputfield-lg":t.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},Ce=(()=>{class t extends ue{name="checkbox";style=Oe;classes=qe;static \u0275fac=(()=>{let e;return function(n){return(e||(e=m(t)))(n||t)}})();static \u0275prov=h({token:t,factory:t.\u0275fac})}return t})();var _e=new U("CHECKBOX_INSTANCE"),ze={provide:ge,useExisting:P(()=>we),multi:!0},we=(()=>{class t extends xe{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=F();size=F();onChange=new x;onFocus=new x;onBlur=new x;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:se(this.value,this.modelValue())}_indeterminate=D(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=a(Ce);bindDirectiveInstance=a(k,{self:!0});$pcCheckbox=a(_e,{optional:!0,skipSelf:!0})??void 0;$variant=j(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._checkboxIconTemplate=e.template;break;case"checkboxicon":this._checkboxIconTemplate=e.template;break}})}onChanges(e){e.indeterminate&&this._indeterminate.set(e.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(e){let o,n=this.injector.get(ke,null,{optional:!0,self:!0}),r=n&&!this.formControl?n.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=r.filter(c=>!ae(c,this.value)):o=r?[...r,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:o,originalEvent:e})}handleChange(e){this.readonly||this.updateModel(e)}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(e,o){o(e),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=m(t)))(n||t)}})();static \u0275cmp=v({type:t,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,n,r){if(o&1&&Y(r,Se,4)(r,le,4),o&2){let c;_(c=w())&&(n.checkboxIconTemplate=c.first),_(c=w())&&(n.templates=c)}},viewQuery:function(o,n){if(o&1&&W(De,5),o&2){let r;_(r=w())&&(n.inputViewChild=r.first)}},hostVars:6,hostBindings:function(o,n){o&2&&(l("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled())("data-p",n.dataP),u(n.cn(n.cx("root"),n.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",g],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",te],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",g],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",g],autofocus:[2,"autofocus","autofocus",g],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[J([ze,Ce,{provide:_e,useExisting:t},{provide:he,useExisting:t}]),G([k]),y],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){o&1&&(E(0,"input",1,0),X("focus",function(c){return n.onInputFocus(c)})("blur",function(c){return n.onInputBlur(c)})("change",function(c){return n.handleChange(c)}),T(),E(2,"div",2),f(3,je,3,2,"ng-container",3)(4,Re,1,0,null,4),T()),o&2&&(Z(n.inputStyle),u(n.cn(n.cx("input"),n.inputClass)),s("checked",n.checked)("pBind",n.ptm("input")),l("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),d(2),u(n.cx("box")),s("pBind",n.ptm("box")),l("data-p",n.dataP),d(),s("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),d(),s("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",ee(22,Ee,n.checked,n.cx("icon"),n.dataP)))},dependencies:[re,ne,oe,ie,I,me,ve,pe,k],encapsulation:2,changeDetection:0})}return t})(),Tt=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=Q({type:t});static \u0275inj=L({imports:[we,I,I]})}return t})();var M=class t{messageService=a(de);show(i,e,o,n=4e3){this.messageService.add({severity:i,summary:e,detail:o,life:n})}success(i,e="Success",o=4e3){this.show("success",e,i,o)}error(i,e="Error",o=5e3){this.show("error",e,i,o)}warn(i,e="Warning",o=4e3){this.show("warn",e,i,o)}info(i,e="Info",o=4e3){this.show("info",e,i,o)}clear(){this.messageService.clear()}static \u0275fac=function(e){return new(e||t)};static \u0275prov=h({token:t,factory:t.\u0275fac,providedIn:"root"})};var Ot={production:!1,apiUrl:"/api",imagesBaseUrl:"http://localhost:8080"};var Ie=class t{toast=a(M);router=a(ce);storage=a(fe);handle(i,e="Something went wrong"){i instanceof R?this.handleHttpError(i,e):i instanceof Error?this.toast.error(i.message||e):this.toast.error(e)}extractMessage(i,e="Something went wrong"){return i instanceof R?i.error?.messageEn||this.getStatusMessage(i.status)||e:i instanceof Error&&i.message||e}handleHttpError(i,e){let n=i.error?.messageEn||this.getStatusMessage(i.status)||e;switch(i.status){case 0:this.toast.error("Unable to connect to the server. Check your internet connection.","Connection Error");break;case 400:this.toast.error(n,"Bad Request");break;case 401:this.toast.warn("Your session has expired. Please log in again.","Session Expired"),this.storage.clear(),this.router.navigateByUrl("/auth/login");break;case 403:this.toast.error("You do not have permission to perform this action.","Access Denied");break;case 404:this.toast.error(n||"The requested resource was not found.","Not Found");break;case 422:this.toast.error(n,"Validation Error");break;case 429:this.toast.warn("Too many requests. Please slow down.","Rate Limited");break;case 500:case 502:case 503:this.toast.error("A server error occurred. Please try again later.","Server Error");break;default:this.toast.error(n||e)}}getStatusMessage(i){return{0:"No internet connection",400:"Invalid request",401:"Session expired",403:"Access denied",404:"Not found",422:"Validation failed",429:"Too many requests",500:"Internal server error",502:"Bad gateway",503:"Service unavailable"}[i]??""}static \u0275fac=function(e){return new(e||t)};static \u0275prov=h({token:t,factory:t.\u0275fac,providedIn:"root"})};export{Je as a,et as b,we as c,Tt as d,Ot as e,M as f,Ie as g};
