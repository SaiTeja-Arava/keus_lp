import { c as create_ssr_component, b as subscribe, v as validate_component, d as compute_rest_props, e as spread, f as escape_object, g as escape_attribute_value, h as add_attribute, i as escape } from './index-a8b3227f.js';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { f as formInview, b as booked, a as formToggler, F as Fa, c as classnames } from './index3-31a87d65.js';
import './index2-ebbb0c9b.js';

const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ariaLabel;
  let classes;
  let defaultAriaLabel;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "active",
    "block",
    "children",
    "close",
    "color",
    "disabled",
    "href",
    "inner",
    "outline",
    "size",
    "style",
    "value",
    "white"
  ]);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { block = false } = $$props;
  let { children = void 0 } = $$props;
  let { close = false } = $$props;
  let { color = "secondary" } = $$props;
  let { disabled = false } = $$props;
  let { href = "" } = $$props;
  let { inner = void 0 } = $$props;
  let { outline = false } = $$props;
  let { size = null } = $$props;
  let { style = "" } = $$props;
  let { value = "" } = $$props;
  let { white = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.white === void 0 && $$bindings.white && white !== void 0)
    $$bindings.white(white);
  ariaLabel = $$props["aria-label"];
  classes = classnames(className, close ? "btn-close" : "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "d-block w-100" : false, {
    active,
    "btn-close-white": close && white
  });
  defaultAriaLabel = close ? "Close" : null;
  return `${href ? `<a${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { disabled: disabled || null },
      { href: escape_attribute_value(href) },
      {
        "aria-label": escape_attribute_value(ariaLabel || defaultAriaLabel)
      },
      { style: escape_attribute_value(style) }
    ],
    {}
  )}${add_attribute("this", inner, 0)}>${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}</a>` : `<button${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { disabled: disabled || null },
      { value: escape_attribute_value(value) },
      {
        "aria-label": escape_attribute_value(ariaLabel || defaultAriaLabel)
      },
      { style: escape_attribute_value(style) }
    ],
    {}
  )}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      ${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}
    `}</button>`}`;
});
const css = {
  code: ".btn-holder.svelte-12xz5ha.svelte-12xz5ha{position:fixed;z-index:999999999;background-color:rgba(255,255,255,.8);font-size:5vw;bottom:0;min-height:8vh;min-width:100vw;display:flex;align-items:center;justify-content:center}.desc.svelte-12xz5ha.svelte-12xz5ha{color:#fff;margin:.3vw auto;font-size:1vw}.goIcon.svelte-12xz5ha.svelte-12xz5ha{margin:auto}.icon.svelte-12xz5ha.svelte-12xz5ha{margin:.5vw}.nav-link.svelte-12xz5ha.svelte-12xz5ha{font-size:1vw;display:flex;align-items:center;padding:1vw;transition:100ms ;color:#835031}.mobNum.svelte-12xz5ha.svelte-12xz5ha{font-weight:700;font-size:1vw}.nav-item.svelte-12xz5ha.svelte-12xz5ha{margin:0 1.5vw;display:flex;align-items:center;transition:200ms}.nav-link.svelte-12xz5ha.svelte-12xz5ha:hover{scale:1.08}.navbar.svelte-12xz5ha.svelte-12xz5ha{padding-left:3vw;transition:500ms;background-color:rgba(255,255,255,.9)}.mainLogo.svelte-12xz5ha.svelte-12xz5ha{width:4.5vw;opacity:1}.goToTop.svelte-12xz5ha.svelte-12xz5ha{color:#56483D;position:fixed;z-index:99;bottom:2.5vw;right:-7vw;transition:300ms}.goBtn.svelte-12xz5ha.svelte-12xz5ha{background-color:#56483D;display:block;position:absolute;right:0;bottom:0;text-align:center;padding:1vw 2vw 1vw;font-weight:600;text-decoration:none;border-radius:50%;transition:all 500ms}.goToTop.svelte-12xz5ha:hover .goBtn.svelte-12xz5ha{cursor:pointer;bottom:1vw;background-color:#5d3923;box-shadow:0 .2vw .4vw #000}.submit.svelte-12xz5ha.svelte-12xz5ha{margin:auto;width:70vw;opacity:1;color:#fff;background-color:#835031;font-size:5vw;padding:2vw 5vw;box-shadow:1vw 1vw 4vw #835031 ;border-radius:2vw;border:none}@media screen and (max-width:800px){.mainLogo.svelte-12xz5ha.svelte-12xz5ha{width:70%}.icon.svelte-12xz5ha.svelte-12xz5ha{margin:2vw}.nav-link.svelte-12xz5ha.svelte-12xz5ha{font-size:20px}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $formInview, $$unsubscribe_formInview;
  let $booked, $$unsubscribe_booked;
  let $formToggler, $$unsubscribe_formToggler;
  $$unsubscribe_formInview = subscribe(formInview, (value) => $formInview = value);
  $$unsubscribe_booked = subscribe(booked, (value) => $booked = value);
  $$unsubscribe_formToggler = subscribe(formToggler, (value) => $formToggler = value);
  let innerWidth;
  $$result.css.add(css);
  $$unsubscribe_formInview();
  $$unsubscribe_booked();
  $$unsubscribe_formToggler();
  return `

<nav class="${"navbar fixed-top pt-0 pb-0 navbar-expand-md svelte-12xz5ha"}"><div class="${"container-fluid"}"><a class="${"navbar-brand"}"><img src="${"images/logo.png"}" alt="${"logo"}" class="${"mainLogo svelte-12xz5ha"}"></a>
      
      <div><ul class="${"navbar-nav mb-2 mb-lg-0 ms-auto"}"><li class="${"nav-item svelte-12xz5ha"}" style="${"margin:0;transition:1s"}"><a class="${"nav-link mobNum svelte-12xz5ha"}" aria-current="${"page"}" href="${"tel:9392905179"}"><span class="${"icon svelte-12xz5ha"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faPhone, color: "#835031" }, {}, {})}</span>
              9392905179
            </a></li>
          ${$formInview && innerWidth > 700 && $booked == 0 ? `<li class="${"nav-item svelte-12xz5ha"}"><span class="${"nav-link svelte-12xz5ha"}">${validate_component(Button, "Button").$$render(
    $$result,
    {
      style: "background-color:#835031;font-size:1vw;box-shadow:.1vw .1vw .4vw #835031;border:none;opacity:1"
    },
    {},
    {
      default: () => {
        return `Book your Appointment
                `;
      }
    }
  )}</span></li>` : ``}</ul></div></div></nav>
  ${$formInview && innerWidth < 700 && !$formToggler && $booked == 0 ? `<div class="${"btn-holder svelte-12xz5ha"}"><button class="${"submit svelte-12xz5ha"}">Book your Appointment</button></div>` : ``}
  <div id="${"top"}"></div>
 ${``}
 
${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-10d2ed36.js.map
