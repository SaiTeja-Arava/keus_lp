import { c as create_ssr_component, b as subscribe, o as onDestroy, h as add_attribute, v as validate_component, k as each, i as escape, d as compute_rest_props, e as spread, f as escape_object, g as escape_attribute_value, l as createEventDispatcher, m as missing_component, p as compute_slots } from './index-a8b3227f.js';
import { a as formToggler, b as booked, f as formInview, F as Fa, c as classnames, i as isObject$1, g as getColumnSizeClass, u as uuid } from './index3-31a87d65.js';
import { faCheck, faCircleChevronDown, faPlayCircle, faChevronRight, faStar, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '@splidejs/splide-extension-auto-scroll';
import { faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './index2-ebbb0c9b.js';

function getSide(placement) {
  return placement.split('-')[0];
}

function getAlignment(placement) {
  return placement.split('-')[1];
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
}

function getLengthFromAxis(axis) {
  return axis === 'y' ? 'height' : 'width';
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === 'x';
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case 'start':
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain positioning strategy.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  if (process.env.NODE_ENV !== "production") {
    if (platform == null) {
      console.error(['Floating UI: `platform` property was not passed to config. If you', 'want to use Floating UI on the web, install @floating-ui/dom', 'instead of the /core package. Otherwise, you can create your own', '`platform`: https://floating-ui.com/docs/platform'].join(' '));
    }
    if (validMiddleware.filter(_ref => {
      let {
        name
      } = _ref;
      return name === 'autoPlacement' || name === 'flip';
    }).length > 1) {
      throw new Error(['Floating UI: duplicate `flip` and/or `autoPlacement` middleware', 'detected. This will lead to an infinite loop. Ensure only one of', 'either has been passed to the `middleware` array.'].join(' '));
    }
    if (!reference || !floating) {
      console.error(['Floating UI: The reference and/or floating element was not defined', 'when `computePosition()` was called. Ensure that both elements have', 'been created and can be measured.'].join(' '));
    }
  }
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (process.env.NODE_ENV !== "production") {
      if (resetCount > 50) {
        console.warn(['Floating UI: The middleware lifecycle appears to be running in an', 'infinite loop. This is usually caused by a `reset` continually', 'being returned without a break condition.'].join(' '));
      }
    }
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}

function getSideObjectFromPadding(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}

function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(middlewareArguments, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = middlewareArguments;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  if (process.env.NODE_ENV !== "production") ;
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

const min$1 = Math.min;
const max$1 = Math.max;

function within(min$1$1, value, max$1$1) {
  return max$1(min$1$1, min$1(value, max$1$1));
}

const hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, matched => hash$1[matched]);
}

function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}

const hash = {
  start: 'end',
  end: 'start'
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, matched => hash[matched]);
}

function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}

/**
 * Changes the placement of the floating element to one that will fit if the
 * initially specified `placement` does not.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(middlewareArguments) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = middlewareArguments;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const side = getSide(placement);
      const isBasePlacement = side === initialPlacement;
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
        overflows.push(overflow[main], overflow[cross]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip$, _middlewareData$flip2;
        const nextIndex = ((_middlewareData$flip$ = (_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) != null ? _middlewareData$flip$ : 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = 'bottom';
        switch (fallbackStrategy) {
          case 'bestFit':
            {
              var _overflowsData$map$so;
              const placement = (_overflowsData$map$so = overflowsData.map(d => [d, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0].placement;
              if (placement) {
                resetPlacement = placement;
              }
              break;
            }
          case 'initialPlacement':
            resetPlacement = initialPlacement;
            break;
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

async function convertValueToCoords(middlewareArguments, value) {
  const {
    placement,
    platform,
    elements
  } = middlewareArguments;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === 'x';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = typeof value === 'function' ? value(middlewareArguments) : value;

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Displaces the floating element from its reference element.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (value) {
  if (value === void 0) {
    value = 0;
  }
  return {
    name: 'offset',
    options: value,
    async fn(middlewareArguments) {
      const {
        x,
        y
      } = middlewareArguments;
      const diffCoords = await convertValueToCoords(middlewareArguments, value);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};

function getCrossAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/**
 * Shifts the floating element in order to keep it in view when it will overflow
 * a clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(middlewareArguments) {
      const {
        x,
        y,
        placement
      } = middlewareArguments;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getSide(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...middlewareArguments,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};

function getWindow(node) {
  var _node$ownerDocument;
  return ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function getNodeName(node) {
  return isNode(node) ? (node.nodeName || '').toLowerCase() : '';
}

let uaString;
function getUAString() {
  if (uaString) {
    return uaString;
  }
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    uaString = uaData.brands.map(item => item.brand + "/" + item.version).join(' ');
    return uaString;
  }
  return navigator.userAgent;
}

function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function isShadowRoot(node) {
  // Browsers without `ShadowRoot` support
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isContainingBlock(element) {
  // TODO: Try and use feature detection here instead
  const isFirefox = /firefox/i.test(getUAString());
  const css = getComputedStyle$1(element);
  const backdropFilter = css.backdropFilter || css.WebkitBackdropFilter;

  // This is non-exhaustive but covers the most common CSS properties that
  // create a containing block.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return css.transform !== 'none' || css.perspective !== 'none' || (backdropFilter ? backdropFilter !== 'none' : false) || isFirefox && css.willChange === 'filter' || isFirefox && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective'].some(value => css.willChange.includes(value)) || ['paint', 'layout', 'strict', 'content'].some(
  // TS 4.1 compat
  value => {
    const contain = css.contain;
    return contain != null ? contain.includes(value) : false;
  });
}
function isLayoutViewport() {
  // Not Safari
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
  // Feature detection for this fails in various ways
  // • Always-visible scrollbar or not
  // • Width of <html>, etc.
  // const vV = win.visualViewport;
  // return vV ? Math.abs(win.innerWidth / vV.scale - vV.width) < 0.5 : true;
}

function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}

const min = Math.min;
const max = Math.max;
const round = Math.round;

function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width);
  let height = parseFloat(css.height);
  const offsetWidth = element.offsetWidth;
  const offsetHeight = element.offsetHeight;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    fallback: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

const FALLBACK_SCALE = {
  x: 1,
  y: 1
};
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    fallback
  } = getCssDimensions(domElement);
  let x = (fallback ? round(rect.width) : rect.width) / width;
  let y = (fallback ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  var _win$visualViewport, _win$visualViewport2;
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = FALLBACK_SCALE;
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const win = domElement ? getWindow(domElement) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  let x = (clientRect.left + (addVisualOffsets ? ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0 : 0)) / scale.x;
  let y = (clientRect.top + (addVisualOffsets ? ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0 : 0)) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      iframeRect.x += (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      iframeRect.y += (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += iframeRect.x;
      y += iframeRect.y;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}

function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}

function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(element, true, strategy === 'fixed', offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node
  node.assignedSlot ||
  // DOM Element detected
  node.parentNode || (
  // ShadowRoot detected
  isShadowRoot(node) ? node.host : null) ||
  // Fallback
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element) {
  const window = getWindow(element);
  let offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
    return window;
  }
  return offsetParent || getContainingBlock(element) || window;
}

function getDimensions(element) {
  return getCssDimensions(element);
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = {
    x: 1,
    y: 1
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
    // This doesn't appear to need to be negated.
    // else if (documentElement) {
    //   offsets.x = getWindowScrollBarX(documentElement);
    // }
  }

  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}

function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable
function getDocumentRect(element) {
  var _element$ownerDocumen;
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  const width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  const height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    // @ts-ignore assume body is always available
    return node.ownerDocument.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}

function getOverflowAncestors(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}

// Returns the inner client rect, subtracting scrollbars if present
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {
    x: 1,
    y: 1
  };
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y,
    width,
    height
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  if (clippingAncestor === 'viewport') {
    return rectToClientRect(getViewportRect(element, strategy));
  }
  if (isElement(clippingAncestor)) {
    return getInnerBoundingClientRect(clippingAncestor, strategy);
  }
  return rectToClientRect(getDocumentRect(getDocumentElement(element)));
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const containingBlock = isContainingBlock(currentNode);
    const shouldDropCurrentNode = elementIsFixed ? !containingBlock && !currentContainingBlockComputedStyle : !containingBlock && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

const platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getScale,
  async getElementRects(_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...(await getDimensionsFn(floating))
      }
    };
  },
  getClientRects: element => Array.from(element.getClientRects()),
  isRTL: element => getComputedStyle$1(element).direction === 'rtl'
};

/**
 * Automatically updates the position of the floating element when necessary.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll: _ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false
  } = options;
  const ancestorScroll = _ancestorScroll && !animationFrame;
  const ancestors = ancestorScroll || ancestorResize ? [...(isElement(reference) ? getOverflowAncestors(reference) : reference.contextElement ? getOverflowAncestors(reference.contextElement) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  let observer = null;
  if (elementResize) {
    let initialUpdate = true;
    observer = new ResizeObserver(() => {
      if (!initialUpdate) {
        update();
      }
      initialUpdate = false;
    });
    isElement(reference) && !animationFrame && observer.observe(reference);
    if (!isElement(reference) && reference.contextElement && !animationFrame) {
      observer.observe(reference.contextElement);
    }
    observer.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _observer;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    (_observer = observer) == null ? void 0 : _observer.disconnect();
    observer = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain CSS positioning
 * strategy.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

const Collapse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "isOpen",
    "class",
    "horizontal",
    "navbar",
    "onEntering",
    "onEntered",
    "onExiting",
    "onExited",
    "expand",
    "toggler"
  ]);
  const dispatch = createEventDispatcher();
  let { isOpen = false } = $$props;
  let { class: className = "" } = $$props;
  let { horizontal = false } = $$props;
  let { navbar = false } = $$props;
  let { onEntering = () => dispatch("opening") } = $$props;
  let { onEntered = () => dispatch("open") } = $$props;
  let { onExiting = () => dispatch("closing") } = $$props;
  let { onExited = () => dispatch("close") } = $$props;
  let { expand = false } = $$props;
  let { toggler = null } = $$props;
  let windowWidth = 0;
  let _wasMaximized = false;
  const minWidth = {};
  minWidth["xs"] = 0;
  minWidth["sm"] = 576;
  minWidth["md"] = 768;
  minWidth["lg"] = 992;
  minWidth["xl"] = 1200;
  function notify() {
    dispatch("update", isOpen);
  }
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.horizontal === void 0 && $$bindings.horizontal && horizontal !== void 0)
    $$bindings.horizontal(horizontal);
  if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0)
    $$bindings.navbar(navbar);
  if ($$props.onEntering === void 0 && $$bindings.onEntering && onEntering !== void 0)
    $$bindings.onEntering(onEntering);
  if ($$props.onEntered === void 0 && $$bindings.onEntered && onEntered !== void 0)
    $$bindings.onEntered(onEntered);
  if ($$props.onExiting === void 0 && $$bindings.onExiting && onExiting !== void 0)
    $$bindings.onExiting(onExiting);
  if ($$props.onExited === void 0 && $$bindings.onExited && onExited !== void 0)
    $$bindings.onExited(onExited);
  if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0)
    $$bindings.expand(expand);
  if ($$props.toggler === void 0 && $$bindings.toggler && toggler !== void 0)
    $$bindings.toggler(toggler);
  classes = classnames(className, {
    "collapse-horizontal": horizontal,
    "navbar-collapse": navbar
  });
  {
    if (navbar && expand) {
      if (windowWidth >= minWidth[expand] && !isOpen) {
        isOpen = true;
        _wasMaximized = true;
        notify();
      } else if (windowWidth < minWidth[expand] && _wasMaximized) {
        isOpen = false;
        _wasMaximized = false;
        notify();
      }
    }
  }
  return `

${isOpen ? `<div${spread(
    [
      {
        style: escape_attribute_value(navbar ? void 0 : "overflow: hidden;")
      },
      escape_object($$restProps),
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>` : ``}`;
});
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "body", "color", "inverse", "outline", "style"]);
  let { class: className = "" } = $$props;
  let { body = false } = $$props;
  let { color = "" } = $$props;
  let { inverse = false } = $$props;
  let { outline = false } = $$props;
  let { style = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  classes = classnames(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false);
  return `<div${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { style: escape_attribute_value(style) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CardBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "card-body");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Col = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "xs", "sm", "md", "lg", "xl", "xxl"]);
  let { class: className = "" } = $$props;
  let { xs = void 0 } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  const colClasses = [];
  const lookup = { xs, sm, md, lg, xl, xxl };
  Object.keys(lookup).forEach((colWidth) => {
    const columnProp = lookup[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    if (isObject$1(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      if (columnProp.size || columnProp.size === "") {
        colClasses.push(colClass);
      }
      if (columnProp.push) {
        colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      }
      if (columnProp.pull) {
        colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      }
      if (columnProp.offset) {
        colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
      }
      if (columnProp.order) {
        colClasses.push(`order${colSizeInterfix}${columnProp.order}`);
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });
  if (!colClasses.length) {
    colClasses.push("col");
  }
  if (className) {
    colClasses.push(className);
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0)
    $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  return `<div${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(colClasses.join(" "))
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const FormCheck = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let inputClasses;
  let idFor;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "checked",
    "disabled",
    "group",
    "id",
    "inline",
    "inner",
    "invalid",
    "label",
    "name",
    "reverse",
    "size",
    "type",
    "valid",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { checked = false } = $$props;
  let { disabled = false } = $$props;
  let { group = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { inline = false } = $$props;
  let { inner = void 0 } = $$props;
  let { invalid = false } = $$props;
  let { label = "" } = $$props;
  let { name = "" } = $$props;
  let { reverse = false } = $$props;
  let { size = "" } = $$props;
  let { type = "checkbox" } = $$props;
  let { valid = false } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.reverse === void 0 && $$bindings.reverse && reverse !== void 0)
    $$bindings.reverse(reverse);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  classes = classnames(className, "form-check", {
    "form-check-reverse": reverse,
    "form-switch": type === "switch",
    "form-check-inline": inline,
    [`form-control-${size}`]: size
  });
  inputClasses = classnames("form-check-input", { "is-invalid": invalid, "is-valid": valid });
  idFor = id || label;
  return `<div${add_attribute("class", classes, 0)}>${type === "radio" ? `<input${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(inputClasses)
      },
      { id: escape_attribute_value(idFor) },
      { type: "radio" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      { value: escape_attribute_value(value) }
    ],
    {}
  )}${value === group ? add_attribute("checked", true, 1) : ""}${add_attribute("this", inner, 0)}>` : `${type === "switch" ? `<input${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(inputClasses)
      },
      { id: escape_attribute_value(idFor) },
      { type: "checkbox" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      { value: escape_attribute_value(value) }
    ],
    {}
  )}${add_attribute("checked", checked, 1)}${add_attribute("this", inner, 0)}>` : `<input${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(inputClasses)
      },
      { id: escape_attribute_value(idFor) },
      { type: "checkbox" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      { value: escape_attribute_value(value) }
    ],
    {}
  )}${add_attribute("checked", checked, 1)}${add_attribute("this", inner, 0)}>`}`}
  ${label ? `<label class="${"form-check-label"}"${add_attribute("for", idFor, 0)}>${slots.label ? slots.label({}) : `${escape(label)}`}</label>` : ``}</div>`;
});
const FormFeedback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "valid", "tooltip"]);
  let { class: className = "" } = $$props;
  let { valid = void 0 } = $$props;
  let { tooltip = false } = $$props;
  let classes;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.tooltip === void 0 && $$bindings.tooltip && tooltip !== void 0)
    $$bindings.tooltip(tooltip);
  {
    {
      const validMode = tooltip ? "tooltip" : "feedback";
      classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`);
    }
  }
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const InlineContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${slots.default ? slots.default({}) : ``}</div>`;
});
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "bsSize",
    "checked",
    "color",
    "disabled",
    "feedback",
    "files",
    "group",
    "inner",
    "invalid",
    "label",
    "multiple",
    "name",
    "placeholder",
    "plaintext",
    "readonly",
    "reverse",
    "size",
    "type",
    "valid",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { bsSize = void 0 } = $$props;
  let { checked = false } = $$props;
  let { color = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { feedback = void 0 } = $$props;
  let { files = void 0 } = $$props;
  let { group = void 0 } = $$props;
  let { inner = void 0 } = $$props;
  let { invalid = false } = $$props;
  let { label = void 0 } = $$props;
  let { multiple = void 0 } = $$props;
  let { name = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { plaintext = false } = $$props;
  let { readonly = void 0 } = $$props;
  let { reverse = false } = $$props;
  let { size = void 0 } = $$props;
  let { type = "text" } = $$props;
  let { valid = false } = $$props;
  let { value = "" } = $$props;
  let classes;
  let tag;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.bsSize === void 0 && $$bindings.bsSize && bsSize !== void 0)
    $$bindings.bsSize(bsSize);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.feedback === void 0 && $$bindings.feedback && feedback !== void 0)
    $$bindings.feedback(feedback);
  if ($$props.files === void 0 && $$bindings.files && files !== void 0)
    $$bindings.files(files);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.plaintext === void 0 && $$bindings.plaintext && plaintext !== void 0)
    $$bindings.plaintext(plaintext);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  if ($$props.reverse === void 0 && $$bindings.reverse && reverse !== void 0)
    $$bindings.reverse(reverse);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        const isNotaNumber = new RegExp("\\D", "g");
        let isBtn = false;
        let formControlClass = "form-control";
        tag = "input";
        switch (type) {
          case "color":
            formControlClass = `form-control form-control-color`;
            break;
          case "range":
            formControlClass = "form-range";
            break;
          case "select":
            formControlClass = `form-select`;
            tag = "select";
            break;
          case "textarea":
            tag = "textarea";
            break;
          case "button":
          case "reset":
          case "submit":
            formControlClass = `btn btn-${color || "secondary"}`;
            isBtn = true;
            break;
          case "hidden":
          case "image":
            formControlClass = void 0;
            break;
          default:
            formControlClass = "form-control";
            tag = "input";
        }
        if (plaintext) {
          formControlClass = `${formControlClass}-plaintext`;
          tag = "input";
        }
        if (size && isNotaNumber.test(size)) {
          console.warn(`Please use the prop "bsSize" instead of the "size" to bootstrap's input sizing.`);
          bsSize = size;
          size = void 0;
        }
        classes = classnames(className, formControlClass, {
          "is-invalid": invalid,
          "is-valid": valid,
          [`form-control-${bsSize}`]: bsSize && !isBtn,
          [`btn-${bsSize}`]: bsSize && isBtn
        });
      }
    }
    $$rendered = `${tag === "input" ? `${type === "text" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "text" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { size: escape_attribute_value(size) }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "password" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "password" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { size: escape_attribute_value(size) }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "color" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "color" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "email" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "email" },
        { disabled: disabled || null },
        { multiple: multiple || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { size: escape_attribute_value(size) }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "file" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "file" },
        { disabled: disabled || null },
        { invalid: escape_attribute_value(invalid) },
        { multiple: multiple || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { valid: escape_attribute_value(valid) }
      ],
      {}
    )}>` : `${type === "checkbox" || type === "radio" || type === "switch" ? `${validate_component(FormCheck, "FormCheck").$$render(
      $$result,
      Object.assign($$restProps, { class: className }, { size: bsSize }, { type }, { disabled }, { invalid }, { label }, { name }, { placeholder }, { reverse }, { readonly }, { valid }, { checked }, { inner }, { group }, { value }),
      {
        checked: ($$value) => {
          checked = $$value;
          $$settled = false;
        },
        inner: ($$value) => {
          inner = $$value;
          $$settled = false;
        },
        group: ($$value) => {
          group = $$value;
          $$settled = false;
        },
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : `${type === "url" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "url" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { size: escape_attribute_value(size) }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "number" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "number" },
        { readonly: readonly || null },
        { name: escape_attribute_value(name) },
        { disabled: disabled || null },
        {
          placeholder: escape_attribute_value(placeholder)
        }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "date" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "date" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "time" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "time" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "datetime" ? `<input${spread(
      [
        escape_object($$restProps),
        { type: "datetime" },
        { readonly: readonly || null },
        { class: escape_attribute_value(classes) },
        { name: escape_attribute_value(name) },
        { disabled: disabled || null },
        {
          placeholder: escape_attribute_value(placeholder)
        }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "datetime-local" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "datetime-local" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "month" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "month" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "color" ? `<input${spread(
      [
        escape_object($$restProps),
        { type: "color" },
        { readonly: readonly || null },
        { class: escape_attribute_value(classes) },
        { name: escape_attribute_value(name) },
        { disabled: disabled || null },
        {
          placeholder: escape_attribute_value(placeholder)
        }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "range" ? `<input${spread(
      [
        escape_object($$restProps),
        { type: "range" },
        { readonly: readonly || null },
        { class: escape_attribute_value(classes) },
        { name: escape_attribute_value(name) },
        { disabled: disabled || null },
        {
          placeholder: escape_attribute_value(placeholder)
        }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "search" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "search" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { size: escape_attribute_value(size) }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "tel" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "tel" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null },
        { size: escape_attribute_value(size) }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "week" ? `<input${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { type: "week" },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `<input${spread(
      [
        escape_object($$restProps),
        { type: escape_attribute_value(type) },
        { readonly: readonly || null },
        { class: escape_attribute_value(classes) },
        { name: escape_attribute_value(name) },
        { disabled: disabled || null },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { value: escape_attribute_value(value) }
      ],
      {}
    )}>`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}` : `${tag === "textarea" ? `<textarea${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { disabled: disabled || null },
        { name: escape_attribute_value(name) },
        {
          placeholder: escape_attribute_value(placeholder)
        },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("this", inner, 0)}>${value || ""}</textarea>` : `${tag === "select" && !multiple ? `<select${spread(
      [
        escape_object($$restProps),
        { class: escape_attribute_value(classes) },
        { name: escape_attribute_value(name) },
        { disabled: disabled || null },
        { readonly: readonly || null }
      ],
      {}
    )}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : ``}</select>

  ` : ``}`}`}
${feedback ? `${Array.isArray(feedback) ? `${each(feedback, (msg) => {
      return `${validate_component(FormFeedback, "FormFeedback").$$render($$result, { valid }, {}, {
        default: () => {
          return `${escape(msg)}`;
        }
      })}`;
    })}` : `${validate_component(FormFeedback, "FormFeedback").$$render($$result, { valid }, {}, {
      default: () => {
        return `${escape(feedback)}`;
      }
    })}`}` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
const ModalBackdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "isOpen", "fade"]);
  let { class: className = "" } = $$props;
  let { isOpen = false } = $$props;
  let { fade = true } = $$props;
  let loaded = false;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  classes = classnames(className, "modal-backdrop");
  return `${isOpen && loaded ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], { classes: fade ? "fade" : "" })}></div>` : ``}`;
});
const ModalBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "modal-body");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const ModalHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "toggle", "closeAriaLabel", "children", "id"]);
  let { class: className = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { closeAriaLabel = "Close" } = $$props;
  let { children = void 0 } = $$props;
  let { id = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.closeAriaLabel === void 0 && $$bindings.closeAriaLabel && closeAriaLabel !== void 0)
    $$bindings.closeAriaLabel(closeAriaLabel);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  classes = classnames(className, "modal-header");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}><h5 class="${"modal-title"}"${add_attribute("id", id, 0)}>${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}</h5>
  ${slots.close ? slots.close({}) : `
    ${typeof toggle === "function" ? `<button type="${"button"}" class="${"btn-close"}"${add_attribute("aria-label", closeAriaLabel, 0)}></button>` : ``}
  `}</div>`;
});
const Portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let ref;
  let portal;
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.removeChild(portal);
    }
  });
  return `<div${spread([escape_object($$restProps)], {})}${add_attribute("this", ref, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const css$g = {
  code: ".modal-open{overflow:hidden;padding-right:0}",
  map: null
};
const dialogBaseClass = "modal-dialog";
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let outer;
  compute_rest_props($$props, [
    "class",
    "static",
    "isOpen",
    "autoFocus",
    "body",
    "centered",
    "container",
    "fullscreen",
    "header",
    "scrollable",
    "size",
    "toggle",
    "labelledBy",
    "backdrop",
    "wrapClassName",
    "modalClassName",
    "contentClassName",
    "fade",
    "unmountOnClose",
    "returnFocusAfterClose"
  ]);
  createEventDispatcher();
  let { class: className = "" } = $$props;
  let { static: staticModal = false } = $$props;
  let { isOpen = false } = $$props;
  let { autoFocus = true } = $$props;
  let { body = false } = $$props;
  let { centered = false } = $$props;
  let { container = void 0 } = $$props;
  let { fullscreen = false } = $$props;
  let { header = void 0 } = $$props;
  let { scrollable = false } = $$props;
  let { size = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { labelledBy = header ? `modal-${uuid()}` : void 0 } = $$props;
  let { backdrop = true } = $$props;
  let { wrapClassName = "" } = $$props;
  let { modalClassName = "" } = $$props;
  let { contentClassName = "" } = $$props;
  let { fade = true } = $$props;
  let { unmountOnClose = true } = $$props;
  let { returnFocusAfterClose = true } = $$props;
  onDestroy(() => {
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.static === void 0 && $$bindings.static && staticModal !== void 0)
    $$bindings.static(staticModal);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.autoFocus === void 0 && $$bindings.autoFocus && autoFocus !== void 0)
    $$bindings.autoFocus(autoFocus);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.fullscreen === void 0 && $$bindings.fullscreen && fullscreen !== void 0)
    $$bindings.fullscreen(fullscreen);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.scrollable === void 0 && $$bindings.scrollable && scrollable !== void 0)
    $$bindings.scrollable(scrollable);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.labelledBy === void 0 && $$bindings.labelledBy && labelledBy !== void 0)
    $$bindings.labelledBy(labelledBy);
  if ($$props.backdrop === void 0 && $$bindings.backdrop && backdrop !== void 0)
    $$bindings.backdrop(backdrop);
  if ($$props.wrapClassName === void 0 && $$bindings.wrapClassName && wrapClassName !== void 0)
    $$bindings.wrapClassName(wrapClassName);
  if ($$props.modalClassName === void 0 && $$bindings.modalClassName && modalClassName !== void 0)
    $$bindings.modalClassName(modalClassName);
  if ($$props.contentClassName === void 0 && $$bindings.contentClassName && contentClassName !== void 0)
    $$bindings.contentClassName(contentClassName);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  if ($$props.unmountOnClose === void 0 && $$bindings.unmountOnClose && unmountOnClose !== void 0)
    $$bindings.unmountOnClose(unmountOnClose);
  if ($$props.returnFocusAfterClose === void 0 && $$bindings.returnFocusAfterClose && returnFocusAfterClose !== void 0)
    $$bindings.returnFocusAfterClose(returnFocusAfterClose);
  $$result.css.add(css$g);
  classnames(dialogBaseClass, className, {
    [`modal-${size}`]: size,
    "modal-fullscreen": fullscreen === true,
    [`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === "string",
    [`${dialogBaseClass}-centered`]: centered,
    [`${dialogBaseClass}-scrollable`]: scrollable
  });
  outer = container === "inline" || staticModal ? InlineContainer : Portal;
  return `${``}
${backdrop && !staticModal ? `${validate_component(outer || missing_component, "svelte:component").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(ModalBackdrop, "ModalBackdrop").$$render($$result, { fade, isOpen }, {}, {})}`;
    }
  })}` : ``}`;
});
function getCols(cols) {
  const colsValue = parseInt(cols);
  if (!isNaN(colsValue)) {
    if (colsValue > 0) {
      return [`row-cols-${colsValue}`];
    }
  } else if (typeof cols === "object") {
    return ["xs", "sm", "md", "lg", "xl"].map((colWidth) => {
      const isXs = colWidth === "xs";
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const value = cols[colWidth];
      if (typeof value === "number" && value > 0) {
        return `row-cols${colSizeInterfix}${value}`;
      }
      return null;
    }).filter((value) => !!value);
  }
  return [];
}
const Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "noGutters", "form", "cols", "inner"]);
  let { class: className = "" } = $$props;
  let { noGutters = false } = $$props;
  let { form = false } = $$props;
  let { cols = 0 } = $$props;
  let { inner = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.noGutters === void 0 && $$bindings.noGutters && noGutters !== void 0)
    $$bindings.noGutters(noGutters);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0)
    $$bindings.cols(cols);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  classes = classnames(className, noGutters ? "gx-0" : null, form ? "form-row" : "row", ...getCols(cols));
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
function createFloatingActions(initOptions) {
  let referenceElement;
  let floatingElement;
  const defaultOptions = {
    autoUpdate: true
  };
  let options = initOptions;
  const getOptions = (mixin) => {
    return { ...defaultOptions, ...initOptions || {}, ...mixin || {} };
  };
  const updatePosition = (updateOptions) => {
    if (referenceElement && floatingElement) {
      options = getOptions(updateOptions);
      computePosition(referenceElement, floatingElement, options).then((v) => {
        Object.assign(floatingElement.style, {
          position: v.strategy,
          left: `${v.x}px`,
          top: `${v.y}px`
        });
        options?.onComputed && options.onComputed(v);
      });
    }
  };
  const referenceAction = (node) => {
    referenceElement = node;
    updatePosition();
  };
  const contentAction = (node, contentOptions) => {
    let autoUpdateDestroy;
    floatingElement = node;
    options = getOptions(contentOptions);
    setTimeout(() => updatePosition(contentOptions), 0);
    updatePosition(contentOptions);
    const destroyAutoUpdate = () => {
      if (autoUpdateDestroy) {
        autoUpdateDestroy();
        autoUpdateDestroy = void 0;
      }
    };
    const initAutoUpdate = ({ autoUpdate: autoUpdate$1 } = options || {}) => {
      destroyAutoUpdate();
      if (autoUpdate$1 !== false) {
        return autoUpdate(referenceElement, floatingElement, () => updatePosition(options), autoUpdate$1 === true ? {} : autoUpdate$1);
      }
      return;
    };
    autoUpdateDestroy = initAutoUpdate();
    return {
      update(contentOptions2) {
        updatePosition(contentOptions2);
        autoUpdateDestroy = initAutoUpdate(contentOptions2);
      },
      destroy() {
        destroyAutoUpdate();
      }
    };
  };
  return [
    referenceAction,
    contentAction,
    updatePosition
  ];
}
function filter({
  loadOptions,
  filterText,
  items,
  multiple,
  value,
  itemId,
  groupBy,
  filterSelectedItems,
  itemFilter,
  convertStringItemsToObjects: convertStringItemsToObjects2,
  filterGroupedItems,
  label
}) {
  if (items && loadOptions)
    return items;
  if (!items)
    return [];
  if (items && items.length > 0 && typeof items[0] !== "object") {
    items = convertStringItemsToObjects2(items);
  }
  let filterResults = items.filter((item) => {
    let matchesFilter = itemFilter(item[label], filterText, item);
    if (matchesFilter && multiple && value?.length) {
      matchesFilter = !value.some((x) => {
        return filterSelectedItems ? x[itemId] === item[itemId] : false;
      });
    }
    return matchesFilter;
  });
  if (groupBy) {
    filterResults = filterGroupedItems(filterResults);
  }
  return filterResults;
}
async function getItems({ dispatch, loadOptions, convertStringItemsToObjects: convertStringItemsToObjects2, filterText }) {
  let res = await loadOptions(filterText).catch((err) => {
    console.warn("svelte-select loadOptions error :>> ", err);
    dispatch("error", { type: "loadOptions", details: err });
  });
  if (res && !res.cancelled) {
    if (res) {
      if (res && res.length > 0 && typeof res[0] !== "object") {
        res = convertStringItemsToObjects2(res);
      }
      dispatch("loaded", { items: res });
    } else {
      res = [];
    }
    return {
      filteredItems: res,
      loading: false,
      focused: true,
      listOpen: true
    };
  }
}
const css$f = {
  code: "svg.svelte-qbd276{width:var(--chevron-icon-width, 20px);height:var(--chevron-icon-width, 20px);color:var(--chevron-icon-colour, currentColor)}",
  map: null
};
const ChevronIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$f);
  return `<svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 20 20"}" focusable="${"false"}" aria-hidden="${"true"}" class="${"svelte-qbd276"}"><path fill="${"currentColor"}" d="${"M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\n          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\n          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\n          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\n          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"}"></path></svg>`;
});
const css$e = {
  code: "svg.svelte-whdbu1{width:var(--clear-icon-width, 20px);height:var(--clear-icon-width, 20px);color:var(--clear-icon-color, currentColor)}",
  map: null
};
const ClearIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
  return `<svg width="${"100%"}" height="${"100%"}" viewBox="${"-2 -2 50 50"}" focusable="${"false"}" aria-hidden="${"true"}" role="${"presentation"}" class="${"svelte-whdbu1"}"><path fill="${"currentColor"}" d="${"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124\n    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"}"></path></svg>`;
});
const css$d = {
  code: ".loading.svelte-1p3nqvd{width:var(--spinner-width, 20px);height:var(--spinner-height, 20px);color:var(--spinner-color, var(--icons-color));animation:svelte-1p3nqvd-rotate 0.75s linear infinite;transform-origin:center center;transform:none}.circle_path.svelte-1p3nqvd{stroke-dasharray:90;stroke-linecap:round}@keyframes svelte-1p3nqvd-rotate{100%{transform:rotate(360deg)}}",
  map: null
};
const LoadingIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$d);
  return `<svg class="${"loading svelte-1p3nqvd"}" viewBox="${"25 25 50 50"}"><circle class="${"circle_path svelte-1p3nqvd"}" cx="${"50"}" cy="${"50"}" r="${"20"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"5"}" stroke-miterlimit="${"10"}"></circle></svg>`;
});
const css$c = {
  code: ".svelte-select.svelte-18e845.svelte-18e845.svelte-18e845{--borderRadius:var(--border-radius);--clearSelectColor:var(--clear-select-color);--clearSelectWidth:var(--clear-select-width);--disabledBackground:var(--disabled-background);--disabledBorderColor:var(--disabled-border-color);--disabledColor:var(--disabled-color);--disabledPlaceholderColor:var(--disabled-placeholder-color);--disabledPlaceholderOpacity:var(--disabled-placeholder-opacity);--errorBackground:var(--error-background);--errorBorder:var(--error-border);--groupItemPaddingLeft:var(--group-item-padding-left);--groupTitleColor:var(--group-title-color);--groupTitleFontSize:var(--group-title-font-size);--groupTitleFontWeight:var(--group-title-font-weight);--groupTitlePadding:var(--group-title-padding);--groupTitleTextTransform:var(--group-title-text-transform);--indicatorColor:var(--chevron-color);--indicatorHeight:var(--chevron-height);--indicatorWidth:var(--chevron-width);--inputColor:var(--input-color);--inputLeft:var(--input-left);--inputLetterSpacing:var(--input-letter-spacing);--inputMargin:var(--input-margin);--inputPadding:var(--input-padding);--itemActiveBackground:var(--item-active-background);--itemColor:var(--item-color);--itemFirstBorderRadius:var(--item-first-border-radius);--itemHoverBG:var(--item-hover-bg);--itemHoverColor:var(--item-hover-color);--itemIsActiveBG:var(--item-is-active-bg);--itemIsActiveColor:var(--item-is-active-color);--itemIsNotSelectableColor:var(--item-is-not-selectable-color);--itemPadding:var(--item-padding);--listBackground:var(--list-background);--listBorder:var(--list-border);--listBorderRadius:var(--list-border-radius);--listEmptyColor:var(--list-empty-color);--listEmptyPadding:var(--list-empty-padding);--listEmptyTextAlign:var(--list-empty-text-align);--listMaxHeight:var(--list-max-height);--listPosition:var(--list-position);--listShadow:var(--list-shadow);--listZIndex:var(--list-z-index);--multiItemBG:var(--multi-item-bg);--multiItemBorderRadius:var(--multi-item-border-radius);--multiItemDisabledHoverBg:var(--multi-item-disabled-hover-bg);--multiItemDisabledHoverColor:var(--multi-item-disabled-hover-color);--multiItemHeight:var(--multi-item-height);--multiItemMargin:var(--multi-item-margin);--multiItemPadding:var(--multi-item-padding);--multiSelectInputMargin:var(--multi-select-input-margin);--multiSelectInputPadding:var(--multi-select-input-padding);--multiSelectPadding:var(--multi-select-padding);--placeholderColor:var(--placeholder-color);--placeholderOpacity:var(--placeholder-opacity);--selectedItemPadding:var(--selected-item-padding);--spinnerColor:var(--spinner-color);--spinnerHeight:var(--spinner-height);--spinnerWidth:var(--spinner-width);--internal-padding:0 0 0 16px;border:var(--border, 1px solid #d8dbdf);border-radius:var(--border-radius, 6px);min-height:var(--height, 42px);position:relative;display:flex;align-items:stretch;padding:var(--padding, var(--internal-padding));background:var(--background, #fff);margin:var(--margin, 0);width:var(--width, 100%);font-size:var(--font-size, 16px)}.svelte-18e845.svelte-18e845.svelte-18e845{box-sizing:var(--box-sizing, border-box)}.svelte-select.svelte-18e845.svelte-18e845.svelte-18e845:hover{border:var(--border-hover, 1px solid #b2b8bf)}.value-container.svelte-18e845.svelte-18e845.svelte-18e845{display:flex;flex:1 1 0%;flex-wrap:wrap;align-items:center;gap:5px 10px;padding:5px 0;position:relative;overflow:hidden;align-self:stretch}.prepend.svelte-18e845.svelte-18e845.svelte-18e845,.indicators.svelte-18e845.svelte-18e845.svelte-18e845{display:flex;flex-shrink:0;align-items:center}input.svelte-18e845.svelte-18e845.svelte-18e845{position:absolute;cursor:default;border:none;color:var(--input-color, var(--item-color));padding:var(--input-padding, 0);letter-spacing:var(--input-letter-spacing, inherit);margin:var(--input-margin, 0);min-width:10px;top:0;right:0;bottom:0;left:0;background:transparent;font-size:var(--font-size, 16px)}.svelte-18e845:not(.multi)>.value-container.svelte-18e845>input.svelte-18e845{width:100%;height:100%}input.svelte-18e845.svelte-18e845.svelte-18e845::placeholder{color:var(--placeholder-color, #78848f);opacity:var(--placeholder-opacity, 1)}input.svelte-18e845.svelte-18e845.svelte-18e845:focus{outline:none}.svelte-select.focused.svelte-18e845.svelte-18e845.svelte-18e845{border:var(--border-focused, 1px solid #006fe8)}.disabled.svelte-18e845.svelte-18e845.svelte-18e845{background:var(--disabled-background, #ebedef);border-color:var(--disabled-border-color, #ebedef);color:var(--disabled-color, #c1c6cc)}.disabled.svelte-18e845 input.svelte-18e845.svelte-18e845::placeholder{color:var(--disabled-placeholder-color, #c1c6cc);opacity:var(--disabled-placeholder-opacity, 1)}.selected-item.svelte-18e845.svelte-18e845.svelte-18e845{position:relative;overflow:var(--selected-item-overflow, hidden);padding:var(--selected-item-padding, 0 20px 0 0);text-overflow:ellipsis;white-space:nowrap;color:var(--selected-item-color, inherit);font-size:var(--font-size, 16px)}.multi.svelte-18e845 .selected-item.svelte-18e845.svelte-18e845{position:absolute;line-height:var(--height, 42px);height:var(--height, 42px)}.selected-item.svelte-18e845.svelte-18e845.svelte-18e845:focus{outline:none}.hide-selected-item.svelte-18e845.svelte-18e845.svelte-18e845{opacity:0}.icon.svelte-18e845.svelte-18e845.svelte-18e845{display:flex;align-items:center;justify-content:center}.clear-select.svelte-18e845.svelte-18e845.svelte-18e845{all:unset;display:flex;align-items:center;justify-content:center;width:var(--clear-select-width, 40px);height:var(--clear-select-height, 100%);color:var(--clear-select-color, var(--icons-color));margin:var(--clear-select-margin, 0);pointer-events:all;flex-shrink:0}.clear-select.svelte-18e845.svelte-18e845.svelte-18e845:focus{outline:var(--clear-select-focus-outline, 1px solid #006fe8)}.loading.svelte-18e845.svelte-18e845.svelte-18e845{width:var(--loading-width, 40px);height:var(--loading-height);color:var(--loading-color, var(--icons-color));margin:var(--loading--margin, 0);flex-shrink:0}.chevron.svelte-18e845.svelte-18e845.svelte-18e845{width:var(--chevron-width, 40px);height:var(--chevron-height, 40px);background:var(--chevron-background, transparent);pointer-events:var(--chevron-pointer-events, none);color:var(--chevron-color, var(--icons-color));border:var(--chevron-border, 0 0 0 1px solid #d8dbdf);flex-shrink:0}.multi.svelte-18e845.svelte-18e845.svelte-18e845{padding:var(--multi-select-padding, var(--internal-padding))}.multi.svelte-18e845 input.svelte-18e845.svelte-18e845{padding:var(--multi-select-input-padding, 0);position:relative;margin:var(--multi-select-input-margin, 5px 0);flex:1 1 40px}.svelte-select.error.svelte-18e845.svelte-18e845.svelte-18e845{border:var(--error-border, 1px solid #ff2d55);background:var(--error-background, #fff)}.a11y-text.svelte-18e845.svelte-18e845.svelte-18e845{z-index:9999;border:0px;clip:rect(1px, 1px, 1px, 1px);height:1px;width:1px;position:absolute;overflow:hidden;padding:0px;white-space:nowrap}.multi-item.svelte-18e845.svelte-18e845.svelte-18e845{background:var(--multi-item-bg, #ebedef);margin:var(--multi-item-margin, 0);outline:var(--multi-item-outline, 1px solid #ddd);border-radius:var(--multi-item-border-radius, 4px);height:var(--multi-item-height, 25px);line-height:var(--multi-item-height, 25px);display:flex;cursor:default;padding:var(--multi-item-padding, 0 5px);overflow:hidden;gap:var(--multi-item-gap, 4px);outline-offset:-1px;max-width:var(--multi-max-width, none);color:var(--multi-item-color, var(--item-color))}.multi-item.disabled.svelte-18e845.svelte-18e845.svelte-18e845:hover{background:var(--multi-item-disabled-hover-bg, #ebedef);color:var(--multi-item-disabled-hover-color, #c1c6cc)}.multi-item-text.svelte-18e845.svelte-18e845.svelte-18e845{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multi-item-clear.svelte-18e845.svelte-18e845.svelte-18e845{display:flex;align-items:center;justify-content:center;--clear-icon-color:var(--multi-item-clear-icon-color, #000)}.multi-item.active.svelte-18e845.svelte-18e845.svelte-18e845{outline:var(--multi-item-active-outline, 1px solid #006fe8)}.svelte-select-list.svelte-18e845.svelte-18e845.svelte-18e845{box-shadow:var(--list-shadow, 0 2px 3px 0 rgba(44, 62, 80, 0.24));border-radius:var(--list-border-radius, 4px);max-height:var(--list-max-height, 252px);overflow-y:auto;background:var(--list-background, #fff);position:var(--list-position, absolute);z-index:var(--list-z-index, 2);border:var(--list-border)}.prefloat.svelte-18e845.svelte-18e845.svelte-18e845{opacity:0;pointer-events:none}.list-group-title.svelte-18e845.svelte-18e845.svelte-18e845{color:var(--group-title-color, #8f8f8f);cursor:default;font-size:var(--group-title-font-size, 16px);font-weight:var(--group-title-font-weight, 600);height:var(--height, 42px);line-height:var(--height, 42px);padding:var(--group-title-padding, 0 20px);text-overflow:ellipsis;overflow-x:hidden;white-space:nowrap;text-transform:var(--group-title-text-transform, uppercase)}.empty.svelte-18e845.svelte-18e845.svelte-18e845{text-align:var(--list-empty-text-align, center);padding:var(--list-empty-padding, 20px 0);color:var(--list-empty-color, #78848f)}.item.svelte-18e845.svelte-18e845.svelte-18e845{cursor:default;height:var(--item-height, var(--height, 42px));line-height:var(--item-line-height, var(--height, 42px));padding:var(--item-padding, 0 20px);color:var(--item-color, inherit);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;transition:all 0.2s;align-items:center;width:100%}.item.group-item.svelte-18e845.svelte-18e845.svelte-18e845{padding-left:var(--group-item-padding-left, 40px)}.item.svelte-18e845.svelte-18e845.svelte-18e845:active{background:var(--item-active-background, #b9daff)}.item.active.svelte-18e845.svelte-18e845.svelte-18e845{background:var(--item-is-active-bg, #007aff);color:var(--item-is-active-color, #fff)}.item.first.svelte-18e845.svelte-18e845.svelte-18e845{border-radius:var(--item-first-border-radius, 4px 4px 0 0)}.item.hover.svelte-18e845.svelte-18e845.svelte-18e845:not(.active){background:var(--item-hover-bg, #e7f2ff);color:var(--item-hover-color, inherit)}.item.not-selectable.svelte-18e845.svelte-18e845.svelte-18e845,.item.hover.item.not-selectable.svelte-18e845.svelte-18e845.svelte-18e845,.item.active.item.not-selectable.svelte-18e845.svelte-18e845.svelte-18e845,.item.not-selectable.svelte-18e845.svelte-18e845.svelte-18e845:active{color:var(--item-is-not-selectable-color, #999);background:transparent}.required.svelte-18e845.svelte-18e845.svelte-18e845{opacity:0;z-index:-1;position:absolute;top:0;left:0;bottom:0;right:0}",
  map: null
};
function convertStringItemsToObjects(_items) {
  return _items.map((item, index) => {
    return { index, value: item, label: `${item}` };
  });
}
function isItemFirst(itemIndex) {
  return itemIndex === 0;
}
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasValue;
  let hideSelectedItem;
  let showClear;
  let placeholderText;
  let ariaSelection;
  let ariaContext;
  let filteredItems;
  let $$slots = compute_slots(slots);
  const dispatch = createEventDispatcher();
  let { justValue = null } = $$props;
  let { filter: filter$1 = filter } = $$props;
  let { getItems: getItems$1 = getItems } = $$props;
  let { id = null } = $$props;
  let { name = null } = $$props;
  let { container = void 0 } = $$props;
  let { input = void 0 } = $$props;
  let { multiple = false } = $$props;
  let { multiFullItemClearable = false } = $$props;
  let { disabled = false } = $$props;
  let { focused = false } = $$props;
  let { value = null } = $$props;
  let { filterText = "" } = $$props;
  let { placeholder = "Please select" } = $$props;
  let { placeholderAlwaysShow = false } = $$props;
  let { items = null } = $$props;
  let { label = "label" } = $$props;
  let { itemFilter = (label2, filterText2) => `${label2}`.toLowerCase().includes(filterText2.toLowerCase()) } = $$props;
  let { groupBy = void 0 } = $$props;
  let { groupFilter = (groups) => groups } = $$props;
  let { groupHeaderSelectable = false } = $$props;
  let { itemId = "value" } = $$props;
  let { loadOptions = void 0 } = $$props;
  let { containerStyles = "" } = $$props;
  let { hasError = false } = $$props;
  let { filterSelectedItems = true } = $$props;
  let { required = false } = $$props;
  let { createGroupHeaderItem = (groupValue, item) => {
    return { value: groupValue, [label]: groupValue };
  } } = $$props;
  const getFilteredItems = () => {
    return filteredItems;
  };
  let { searchable = true } = $$props;
  let { inputStyles = "" } = $$props;
  let { clearable = true } = $$props;
  let { loading = false } = $$props;
  let { listOpen = false } = $$props;
  let timeout;
  let { debounce = (fn, wait = 1) => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  } } = $$props;
  let { debounceWait = 300 } = $$props;
  let { hideEmptyState = false } = $$props;
  let { inputAttributes = {} } = $$props;
  let { listAutoWidth = true } = $$props;
  let { showChevron = false } = $$props;
  let { listOffset = 5 } = $$props;
  let { hoverItemIndex = 0 } = $$props;
  let { floatingConfig = {} } = $$props;
  let { class: containerClasses = "" } = $$props;
  let activeValue;
  let prev_value;
  let prev_filterText;
  function setValue() {
    if (typeof value === "string") {
      let item = (items || []).find((item2) => item2[itemId] === value);
      value = item || { [itemId]: value, label: value };
    } else if (multiple && Array.isArray(value) && value.length > 0) {
      value = value.map((item) => typeof item === "string" ? { value: item, label: item } : item);
    }
  }
  let _inputAttributes;
  function assignInputAttributes() {
    _inputAttributes = Object.assign(
      {
        autocapitalize: "none",
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: false,
        tabindex: 0,
        type: "text",
        "aria-autocomplete": "list"
      },
      inputAttributes
    );
    if (id) {
      _inputAttributes["id"] = id;
    }
    if (!searchable) {
      _inputAttributes["readonly"] = true;
    }
  }
  function filterGroupedItems(_items) {
    const groupValues = [];
    const groups = {};
    _items.forEach((item) => {
      const groupValue = groupBy(item);
      if (!groupValues.includes(groupValue)) {
        groupValues.push(groupValue);
        groups[groupValue] = [];
        if (groupValue) {
          groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
            id: groupValue,
            groupHeader: true,
            selectable: groupHeaderSelectable
          }));
        }
      }
      groups[groupValue].push(Object.assign({ groupItem: !!groupValue }, item));
    });
    const sortedGroupedItems = [];
    groupFilter(groupValues).forEach((groupValue) => {
      if (groups[groupValue])
        sortedGroupedItems.push(...groups[groupValue]);
    });
    return sortedGroupedItems;
  }
  function dispatchSelectedItem() {
    if (multiple) {
      if (JSON.stringify(value) !== JSON.stringify(prev_value)) {
        if (checkValueForDuplicates()) {
          dispatch("input", value);
        }
      }
      return;
    }
    {
      dispatch("input", value);
    }
  }
  function setupMulti() {
    if (value) {
      if (Array.isArray(value)) {
        value = [...value];
      } else {
        value = [value];
      }
    }
  }
  function setValueIndexAsHoverIndex() {
    const valueIndex = filteredItems.findIndex((i) => {
      return i[itemId] === value[itemId];
    });
    checkHoverSelectable(valueIndex, true);
  }
  function dispatchHover(i) {
    dispatch("hoverItem", i);
  }
  function checkHoverSelectable(startingIndex = 0, ignoreGroup) {
    hoverItemIndex = startingIndex;
    if (!ignoreGroup && groupBy && filteredItems[hoverItemIndex] && !filteredItems[hoverItemIndex].selectable) {
      setHoverIndex(1);
    }
  }
  function setupFilterText() {
    if (!loadOptions && filterText.length === 0)
      return;
    if (loadOptions) {
      debounce(
        async function() {
          loading = true;
          let res = await getItems$1({
            dispatch,
            loadOptions,
            convertStringItemsToObjects,
            filterText
          });
          if (res) {
            loading = res.loading;
            listOpen = listOpen ? res.listOpen : filterText.length > 0 ? true : false;
            focused = listOpen && res.focused;
            items = groupBy ? filterGroupedItems(res.filteredItems) : res.filteredItems;
          } else {
            loading = false;
            focused = true;
            listOpen = true;
          }
        },
        debounceWait
      );
    } else {
      listOpen = true;
      if (multiple) {
        activeValue = void 0;
      }
    }
  }
  function handleFilterEvent(items2) {
    if (listOpen)
      dispatch("filter", items2);
  }
  function computeJustValue() {
    if (multiple)
      return value ? value.map((item) => item[itemId]) : null;
    return value ? value[itemId] : value;
  }
  function checkValueForDuplicates() {
    let noDuplicates = true;
    if (value) {
      const ids = [];
      const uniqueValues = [];
      value.forEach((val) => {
        if (!ids.includes(val[itemId])) {
          ids.push(val[itemId]);
          uniqueValues.push(val);
        } else {
          noDuplicates = false;
        }
      });
      if (!noDuplicates)
        value = uniqueValues;
    }
    return noDuplicates;
  }
  function findItem(selection) {
    let matchTo = selection ? selection[itemId] : value[itemId];
    return items.find((item) => item[itemId] === matchTo);
  }
  function updateValueDisplay(items2) {
    if (!items2 || items2.length === 0 || items2.some((item) => typeof item !== "object"))
      return;
    if (!value || (multiple ? value.some((selection) => !selection || !selection[itemId]) : !value[itemId]))
      return;
    if (Array.isArray(value)) {
      value = value.map((selection) => findItem(selection) || selection);
    } else {
      value = findItem() || value;
    }
  }
  function handleFocus(e) {
    if (e)
      dispatch("focus", e);
    input.focus();
    focused = true;
  }
  function handleClear() {
    value = void 0;
    closeList();
    dispatch("clear", value);
    handleFocus();
  }
  function closeList() {
    filterText = "";
    listOpen = false;
  }
  let { ariaValues = (values) => {
    return `Option ${values}, selected.`;
  } } = $$props;
  let { ariaListOpen = (label2, count) => {
    return `You are currently focused on option ${label2}. There are ${count} results available.`;
  } } = $$props;
  let { ariaFocused = () => {
    return `Select is focused, type to refine list, press down to open the menu.`;
  } } = $$props;
  function handleAriaSelection(_multiple) {
    let selected = void 0;
    if (_multiple && value.length > 0) {
      selected = value.map((v) => v[label]).join(", ");
    } else {
      selected = value[label];
    }
    return ariaValues(selected);
  }
  function handleAriaContent() {
    if (!filteredItems || filteredItems.length === 0)
      return "";
    let _item = filteredItems[hoverItemIndex];
    if (listOpen && _item) {
      let count = filteredItems ? filteredItems.length : 0;
      return ariaListOpen(_item[label], count);
    } else {
      return ariaFocused();
    }
  }
  let list = null;
  onDestroy(() => {
    list?.remove();
  });
  function setHoverIndex(increment) {
    let selectableFilteredItems = filteredItems.filter((item) => !Object.hasOwn(item, "selectable") || item.selectable === true);
    if (selectableFilteredItems.length === 0) {
      return hoverItemIndex = 0;
    }
    if (increment > 0 && hoverItemIndex === filteredItems.length - 1) {
      hoverItemIndex = 0;
    } else if (increment < 0 && hoverItemIndex === 0) {
      hoverItemIndex = filteredItems.length - 1;
    } else {
      hoverItemIndex = hoverItemIndex + increment;
    }
    const hover = filteredItems[hoverItemIndex];
    if (hover && hover.selectable === false) {
      if (increment === 1 || increment === -1)
        setHoverIndex(increment);
      return;
    }
  }
  function isItemActive(item, value2, itemId2) {
    if (multiple)
      return;
    return value2 && value2[itemId2] === item[itemId2];
  }
  function setListWidth() {
    const { width } = container.getBoundingClientRect();
    list.style.width = listAutoWidth ? width + "px" : "auto";
  }
  let _floatingConfig = {
    strategy: "absolute",
    placement: "bottom-start",
    middleware: [offset(listOffset), flip(), shift()],
    autoUpdate: false
  };
  const [floatingRef, floatingContent, floatingUpdate] = createFloatingActions(_floatingConfig);
  let prefloat = true;
  function listMounted(list2, listOpen2) {
    if (!list2 || !listOpen2)
      return prefloat = true;
    setTimeout(
      () => {
        prefloat = false;
      },
      0
    );
  }
  if ($$props.justValue === void 0 && $$bindings.justValue && justValue !== void 0)
    $$bindings.justValue(justValue);
  if ($$props.filter === void 0 && $$bindings.filter && filter$1 !== void 0)
    $$bindings.filter(filter$1);
  if ($$props.getItems === void 0 && $$bindings.getItems && getItems$1 !== void 0)
    $$bindings.getItems(getItems$1);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.multiFullItemClearable === void 0 && $$bindings.multiFullItemClearable && multiFullItemClearable !== void 0)
    $$bindings.multiFullItemClearable(multiFullItemClearable);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.focused === void 0 && $$bindings.focused && focused !== void 0)
    $$bindings.focused(focused);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.placeholderAlwaysShow === void 0 && $$bindings.placeholderAlwaysShow && placeholderAlwaysShow !== void 0)
    $$bindings.placeholderAlwaysShow(placeholderAlwaysShow);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.itemFilter === void 0 && $$bindings.itemFilter && itemFilter !== void 0)
    $$bindings.itemFilter(itemFilter);
  if ($$props.groupBy === void 0 && $$bindings.groupBy && groupBy !== void 0)
    $$bindings.groupBy(groupBy);
  if ($$props.groupFilter === void 0 && $$bindings.groupFilter && groupFilter !== void 0)
    $$bindings.groupFilter(groupFilter);
  if ($$props.groupHeaderSelectable === void 0 && $$bindings.groupHeaderSelectable && groupHeaderSelectable !== void 0)
    $$bindings.groupHeaderSelectable(groupHeaderSelectable);
  if ($$props.itemId === void 0 && $$bindings.itemId && itemId !== void 0)
    $$bindings.itemId(itemId);
  if ($$props.loadOptions === void 0 && $$bindings.loadOptions && loadOptions !== void 0)
    $$bindings.loadOptions(loadOptions);
  if ($$props.containerStyles === void 0 && $$bindings.containerStyles && containerStyles !== void 0)
    $$bindings.containerStyles(containerStyles);
  if ($$props.hasError === void 0 && $$bindings.hasError && hasError !== void 0)
    $$bindings.hasError(hasError);
  if ($$props.filterSelectedItems === void 0 && $$bindings.filterSelectedItems && filterSelectedItems !== void 0)
    $$bindings.filterSelectedItems(filterSelectedItems);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.createGroupHeaderItem === void 0 && $$bindings.createGroupHeaderItem && createGroupHeaderItem !== void 0)
    $$bindings.createGroupHeaderItem(createGroupHeaderItem);
  if ($$props.getFilteredItems === void 0 && $$bindings.getFilteredItems && getFilteredItems !== void 0)
    $$bindings.getFilteredItems(getFilteredItems);
  if ($$props.searchable === void 0 && $$bindings.searchable && searchable !== void 0)
    $$bindings.searchable(searchable);
  if ($$props.inputStyles === void 0 && $$bindings.inputStyles && inputStyles !== void 0)
    $$bindings.inputStyles(inputStyles);
  if ($$props.clearable === void 0 && $$bindings.clearable && clearable !== void 0)
    $$bindings.clearable(clearable);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.listOpen === void 0 && $$bindings.listOpen && listOpen !== void 0)
    $$bindings.listOpen(listOpen);
  if ($$props.debounce === void 0 && $$bindings.debounce && debounce !== void 0)
    $$bindings.debounce(debounce);
  if ($$props.debounceWait === void 0 && $$bindings.debounceWait && debounceWait !== void 0)
    $$bindings.debounceWait(debounceWait);
  if ($$props.hideEmptyState === void 0 && $$bindings.hideEmptyState && hideEmptyState !== void 0)
    $$bindings.hideEmptyState(hideEmptyState);
  if ($$props.inputAttributes === void 0 && $$bindings.inputAttributes && inputAttributes !== void 0)
    $$bindings.inputAttributes(inputAttributes);
  if ($$props.listAutoWidth === void 0 && $$bindings.listAutoWidth && listAutoWidth !== void 0)
    $$bindings.listAutoWidth(listAutoWidth);
  if ($$props.showChevron === void 0 && $$bindings.showChevron && showChevron !== void 0)
    $$bindings.showChevron(showChevron);
  if ($$props.listOffset === void 0 && $$bindings.listOffset && listOffset !== void 0)
    $$bindings.listOffset(listOffset);
  if ($$props.hoverItemIndex === void 0 && $$bindings.hoverItemIndex && hoverItemIndex !== void 0)
    $$bindings.hoverItemIndex(hoverItemIndex);
  if ($$props.floatingConfig === void 0 && $$bindings.floatingConfig && floatingConfig !== void 0)
    $$bindings.floatingConfig(floatingConfig);
  if ($$props.class === void 0 && $$bindings.class && containerClasses !== void 0)
    $$bindings.class(containerClasses);
  if ($$props.handleClear === void 0 && $$bindings.handleClear && handleClear !== void 0)
    $$bindings.handleClear(handleClear);
  if ($$props.ariaValues === void 0 && $$bindings.ariaValues && ariaValues !== void 0)
    $$bindings.ariaValues(ariaValues);
  if ($$props.ariaListOpen === void 0 && $$bindings.ariaListOpen && ariaListOpen !== void 0)
    $$bindings.ariaListOpen(ariaListOpen);
  if ($$props.ariaFocused === void 0 && $$bindings.ariaFocused && ariaFocused !== void 0)
    $$bindings.ariaFocused(ariaFocused);
  $$result.css.add(css$c);
  {
    if (value)
      setValue();
  }
  {
    if (inputAttributes || !searchable)
      assignInputAttributes();
  }
  {
    if (multiple)
      setupMulti();
  }
  {
    if (multiple && value && value.length > 1)
      checkValueForDuplicates();
  }
  {
    if (value)
      dispatchSelectedItem();
  }
  {
    if (!value && multiple && prev_value)
      dispatch("input", value);
  }
  {
    if (!focused && input)
      closeList();
  }
  {
    if (filterText !== prev_filterText)
      setupFilterText();
  }
  filteredItems = filter$1({
    loadOptions,
    filterText,
    items,
    multiple,
    value,
    itemId,
    groupBy,
    label,
    filterSelectedItems,
    itemFilter,
    convertStringItemsToObjects,
    filterGroupedItems
  });
  {
    if (!multiple && listOpen && value && filteredItems)
      setValueIndexAsHoverIndex();
  }
  {
    if (listOpen && multiple)
      hoverItemIndex = 0;
  }
  {
    dispatchHover(hoverItemIndex);
  }
  hasValue = multiple ? value && value.length > 0 : value;
  hideSelectedItem = hasValue && filterText.length > 0;
  showClear = hasValue && clearable && !disabled && !loading;
  placeholderText = placeholderAlwaysShow && multiple ? placeholder : value ? "" : placeholder;
  ariaSelection = value ? handleAriaSelection(multiple) : "";
  ariaContext = handleAriaContent();
  {
    updateValueDisplay(items);
  }
  justValue = computeJustValue();
  {
    if (!multiple && prev_value && !value)
      dispatch("input", value);
  }
  {
    if (listOpen && filteredItems && !multiple && !value)
      checkHoverSelectable();
  }
  {
    handleFilterEvent(filteredItems);
  }
  {
    if (floatingConfig)
      floatingUpdate(Object.assign(_floatingConfig, floatingConfig));
  }
  {
    listMounted(list, listOpen);
  }
  {
    if (listOpen && container && list)
      setListWidth();
  }
  return `

<div class="${[
    "svelte-select " + escape(containerClasses, true) + " svelte-18e845",
    (multiple ? "multi" : "") + " " + (disabled ? "disabled" : "") + " " + (focused ? "focused" : "") + " " + (listOpen ? "list-open" : "") + " " + (showChevron ? "show-chevron" : "") + " " + (hasError ? "error" : "")
  ].join(" ").trim()}"${add_attribute("style", containerStyles, 0)}${add_attribute("this", container, 0)}>${listOpen ? `<div class="${["svelte-select-list svelte-18e845", prefloat ? "prefloat" : ""].join(" ").trim()}"${add_attribute("this", list, 0)}>${$$slots.list ? `${slots.list ? slots.list({ filteredItems }) : ``}` : `${filteredItems.length > 0 ? `${each(filteredItems, (item, i) => {
    return `<div class="${"list-item svelte-18e845"}" tabindex="${"-1"}"><div class="${[
      "item svelte-18e845",
      (item.groupHeader ? "list-group-title" : "") + " " + (isItemActive(item, value, itemId) ? "active" : "") + " " + (isItemFirst(i) ? "first" : "") + " " + (hoverItemIndex === i ? "hover" : "") + " " + (item.groupItem ? "group-item" : "") + " " + (item?.selectable === false ? "not-selectable" : "")
    ].join(" ").trim()}">${slots.item ? slots.item({ item, index: i }) : `
                                ${escape(item?.[label])}
                            `}</div>
                    </div>`;
  })}` : `${!hideEmptyState ? `${slots.empty ? slots.empty({}) : `
                    <div class="${"empty svelte-18e845"}">No options</div>
                `}` : ``}`}`}</div>` : ``}

    <span aria-live="${"polite"}" aria-atomic="${"false"}" aria-relevant="${"additions text"}" class="${"a11y-text svelte-18e845"}">${focused ? `<span id="${"aria-selection"}" class="${"svelte-18e845"}">${escape(ariaSelection)}</span>
            <span id="${"aria-context"}" class="${"svelte-18e845"}">${escape(ariaContext)}</span>` : ``}</span>

    <div class="${"prepend svelte-18e845"}">${slots.prepend ? slots.prepend({}) : ``}</div>

    <div class="${"value-container svelte-18e845"}">${hasValue ? `${multiple ? `${each(value, (item, i) => {
    return `<div class="${[
      "multi-item svelte-18e845",
      (activeValue === i ? "active" : "") + " " + (disabled ? "disabled" : "")
    ].join(" ").trim()}"><span class="${"multi-item-text svelte-18e845"}">${slots.selection ? slots.selection({ selection: item, index: i }) : `
                                ${escape(item[label])}
                            `}</span>

                        ${!disabled && !multiFullItemClearable && ClearIcon ? `<div class="${"multi-item-clear svelte-18e845"}">${slots["multi-clear-icon"] ? slots["multi-clear-icon"]({}) : `
                                    ${validate_component(ClearIcon, "ClearIcon").$$render($$result, {}, {}, {})}
                                `}
                            </div>` : ``}
                    </div>`;
  })}` : `<div class="${[
    "selected-item svelte-18e845",
    hideSelectedItem ? "hide-selected-item" : ""
  ].join(" ").trim()}">${slots.selection ? slots.selection({ selection: value }) : `
                        ${escape(value[label])}
                    `}</div>`}` : ``}

        <input${spread(
    [
      { readonly: !searchable || null },
      escape_object(_inputAttributes),
      {
        placeholder: escape_attribute_value(placeholderText)
      },
      {
        style: escape_attribute_value(inputStyles)
      },
      { disabled: disabled || null }
    ],
    { classes: "svelte-18e845" }
  )}${add_attribute("this", input, 0)}${add_attribute("value", filterText, 0)}></div>

    <div class="${"indicators svelte-18e845"}">${loading ? `<div class="${"icon loading svelte-18e845"}" aria-hidden="${"true"}">${slots["loading-icon"] ? slots["loading-icon"]({}) : `
                    ${validate_component(LoadingIcon, "LoadingIcon").$$render($$result, {}, {}, {})}
                `}</div>` : ``}

        ${showClear ? `<button class="${"icon clear-select svelte-18e845"}" tabindex="${"0"}">${slots["clear-icon"] ? slots["clear-icon"]({}) : `
                    ${validate_component(ClearIcon, "ClearIcon").$$render($$result, {}, {}, {})}
                `}</button>` : ``}

        ${showChevron ? `<div class="${"icon chevron svelte-18e845"}" aria-hidden="${"true"}">${slots["chevron-icon"] ? slots["chevron-icon"]({ listOpen }) : `
                    ${validate_component(ChevronIcon, "ChevronIcon").$$render($$result, {}, {}, {})}
                `}</div>` : ``}</div>

    <input${add_attribute("name", name, 0)} type="${"hidden"}"${add_attribute("value", value ? JSON.stringify(value) : null, 0)} class="${"svelte-18e845"}">

    ${required && (!value || value.length === 0) ? `${slots.required ? slots.required({ value }) : `
            <select class="${"required svelte-18e845"}" required></select>
        `}` : ``}
</div>`;
});
const Day = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg id="${"day"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"><rect id="${"Rectangle_1999"}" data-name="${"Rectangle 1999"}"${add_attribute("width", width, 0)}${add_attribute("height", width, 0)} fill="${"none"}"></rect><g id="${"Group_3300"}" data-name="${"Group 3300"}" transform="${"translate(-108 -360.446)"}"><path id="${"Union_77"}" data-name="${"Union 77"}" d="${"M-786-4195a1,1,0,0,0,1-1,1,1,0,0,0-1-1h-1v-1a2,2,0,0,0-2-2,2,2,0,0,0-.98.256l-.824.464-.51-.8A1.994,1.994,0,0,0-793-4201a2.014,2.014,0,0,0-1.915,1.419l-.155.512-.512.155A2.013,2.013,0,0,0-797-4197a2,2,0,0,0,2,2h9m0,1h-9a3,3,0,0,1-3-3,3,3,0,0,1,2.129-2.871A3,3,0,0,1-793-4202a3,3,0,0,1,2.529,1.385A2.987,2.987,0,0,1-789-4201a3,3,0,0,1,3,3,2,2,0,0,1,2,2A2,2,0,0,1-786-4194Z"}" transform="${"translate(908 4573)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_559"}" data-name="${"Line 559"}" d="${"M3,.5H0v-1H3Z"}" transform="${"translate(126.547 372.082) rotate(11)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_561"}" data-name="${"Line 561"}" d="${"M3,.5H0v-1H3Z"}" transform="${"matrix(0.946, -0.326, 0.326, 0.946, 126.403, 370.015)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_562"}" data-name="${"Line 562"}" d="${"M3,.5H0v-1H3Z"}" transform="${"matrix(0.656, -0.755, 0.755, 0.656, 125.245, 368.299)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_563"}" data-name="${"Line 563"}" d="${"M3,.5H0v-1H3Z"}" transform="${"translate(123.384 367.391) rotate(-79)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_564"}" data-name="${"Line 564"}" d="${"M3,.5H0v-1H3Z"}" transform="${"matrix(-0.326, -0.946, 0.946, -0.326, 121.319, 367.536)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_565"}" data-name="${"Line 565"}" d="${"M3,.5H0v-1H3Z"}" transform="${"matrix(-0.755, -0.656, 0.656, -0.755, 119.602, 368.693)"}"${add_attribute("fill", color, 0)}></path><path id="${"Path_587"}" data-name="${"Path 587"}" d="${"M2.5,5.584A3,3,0,0,1,.816.1L1.4.911A2.047,2.047,0,0,0,.5,2.584a2,2,0,1,0,4,0h1A3,3,0,0,1,2.5,5.584Z"}" transform="${"translate(124.542 374.54) rotate(-169)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_572"}" data-name="${"Line 572"}" d="${"M1.932,2.286-.323.382.323-.382l2.255,1.9Z"}" transform="${"translate(125.567 374.042)"}"${add_attribute("fill", color, 0)}></path></g></svg></span>`;
});
const Relax = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg id="${"relax"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"><rect id="${"Rectangle_1471"}" data-name="${"Rectangle 1471"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} fill="${"none"}"></rect><g id="${"Group_2583"}" data-name="${"Group 2583"}" transform="${"translate(-309 -654)"}"><circle id="${"Ellipse_734"}" data-name="${"Ellipse 734"}" cx="${"2"}" cy="${"2"}" r="${"2"}" transform="${"translate(323 656)"}"${add_attribute("fill", color, 0)}></circle><path id="${"Rectangle_1447"}" data-name="${"Rectangle 1447"}" d="${"M2,1.5a.5.5,0,0,0-.5.5v8a.5.5,0,0,0,1,0V2A.5.5,0,0,0,2,1.5M2,0A2,2,0,0,1,4,2v8a2,2,0,0,1-4,0V2A2,2,0,0,1,2,0Z"}" transform="${"translate(324.371 659.703) rotate(45)"}"${add_attribute("fill", color, 0)}></path><rect id="${"Rectangle_1448"}" data-name="${"Rectangle 1448"}" width="${"2"}" height="${"8"}" rx="${"1"}" transform="${"translate(316.981 665.982) rotate(45)"}"${add_attribute("fill", color, 0)}></rect><g id="${"Group_2281"}" data-name="${"Group 2281"}" transform="${"translate(140 187)"}"><path id="${"Line_367"}" data-name="${"Line 367"}" d="${"M0,8.763a.5.5,0,0,1-.342-.135.5.5,0,0,1-.023-.707L7.385-.342a.5.5,0,0,1,.707-.023.5.5,0,0,1,.023.707L.365,8.605A.5.5,0,0,1,0,8.763Z"}" transform="${"translate(180.5 476.237)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_368"}" data-name="${"Line 368"}" d="${"M0,3.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l3-3a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-3,3A.5.5,0,0,1,0,3.5Z"}" transform="${"translate(173.5 485.5)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_369"}" data-name="${"Line 369"}" d="${"M0,1.5a.5.5,0,0,1-.485-.379A.5.5,0,0,1-.121.515l4-1a.5.5,0,0,1,.606.364.5.5,0,0,1-.364.606l-4,1A.5.5,0,0,1,0,1.5Z"}" transform="${"translate(176.5 484.5)"}"${add_attribute("fill", color, 0)}></path><path id="${"Line_370"}" data-name="${"Line 370"}" d="${"M4,4.5a.5.5,0,0,1-.354-.146l-4-4a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l4,4A.5.5,0,0,1,4,4.5Z"}" transform="${"translate(180.5 484.5)"}"${add_attribute("fill", color, 0)}></path></g></g></svg></span>`;
});
const Night = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg id="${"night"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"><rect id="${"Rectangle_1999"}" data-name="${"Rectangle 1999"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} fill="${"none"}"></rect><g id="${"Group_3328"}" data-name="${"Group 3328"}" transform="${"translate(-107 -361)"}"><g id="${"Group_3300"}" data-name="${"Group 3300"}" transform="${"translate(0 -0.446)"}"><path id="${"Union_77"}" data-name="${"Union 77"}" d="${"M-786-4195a1,1,0,0,0,1-1,1,1,0,0,0-1-1h-1v-1a2,2,0,0,0-2-2,2,2,0,0,0-.98.256l-.824.464-.51-.8A1.994,1.994,0,0,0-793-4201a2.014,2.014,0,0,0-1.915,1.419l-.155.512-.512.155A2.013,2.013,0,0,0-797-4197a2,2,0,0,0,2,2h9m0,1h-9a3,3,0,0,1-3-3,3,3,0,0,1,2.129-2.871A3,3,0,0,1-793-4202a3,3,0,0,1,2.529,1.385A2.987,2.987,0,0,1-789-4201a3,3,0,0,1,3,3,2,2,0,0,1,2,2A2,2,0,0,1-786-4194Z"}" transform="${"translate(908 4573)"}"${add_attribute("fill", color, 0)}></path></g><g id="${"Group_3327"}" data-name="${"Group 3327"}" transform="${"translate(333.545 53.927) rotate(45)"}"><path id="${"Path_867"}" data-name="${"Path 867"}" d="${"M3.5,7.5a4,4,0,0,1-4-4h1a3,3,0,0,0,6,0h1A4,4,0,0,1,3.5,7.5Z"}" transform="${"translate(72 366.5)"}"${add_attribute("fill", color, 0)}></path><path id="${"Path_868"}" data-name="${"Path 868"}" d="${"M3.5,7.5a4,4,0,0,1-4-4h1a3,3,0,0,0,3,3Z"}" transform="${"translate(74.237 367.869) rotate(45)"}"${add_attribute("fill", color, 0)}></path><path id="${"Path_869"}" data-name="${"Path 869"}" d="${"M.5,3.5h-1a4,4,0,0,1,4-4h0v1a3,3,0,0,0-3,3Z"}" transform="${"translate(81.238 372.819) rotate(135)"}"${add_attribute("fill", color, 0)}></path></g></g></svg></span>`;
});
const Sun = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 53 53"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M26.1505 36.8499C20.1837 36.8499 15.4453 31.9366 15.4453 26.1459C15.4453 20.1797 20.3592 15.4419 26.1505 15.4419C32.1174 15.4419 36.8557 20.3552 36.8557 26.1459C36.8557 31.9366 32.1174 36.8499 26.1505 36.8499ZM26.1505 19.1269C22.2896 19.1269 19.3062 22.2854 19.3062 25.9704C19.3062 29.6554 22.4651 32.814 26.1505 32.814C30.0114 32.814 32.9948 29.6554 32.9948 25.9704C32.9948 22.2854 30.0114 19.1269 26.1505 19.1269Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M26.1492 12.6343C25.0962 12.6343 24.2188 11.7569 24.2188 10.7041V1.93024C24.2188 0.877379 25.0962 0 26.1492 0C27.2021 0 28.0796 0.877379 28.0796 1.93024V10.7041C28.0796 11.7569 27.2021 12.6343 26.1492 12.6343Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M15.2688 17.0209C14.7424 17.0209 14.2158 16.8454 13.8648 16.4944L7.54699 10.1773C6.84501 9.47539 6.84501 8.24706 7.54699 7.36968C8.24898 6.4923 9.47746 6.66778 10.3549 7.36968L16.6728 13.6868C17.3748 14.3887 17.3748 15.617 16.6728 16.4944C16.3218 16.8454 15.7953 17.0209 15.2688 17.0209Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M10.7052 28.0762H1.93046C0.877488 28.0762 0 27.1988 0 26.1459C0 25.093 0.877488 24.2157 1.93046 24.2157H10.7052C11.7582 24.2157 12.6357 25.093 12.6357 26.1459C12.6357 27.1988 11.7582 28.0762 10.7052 28.0762Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M8.95099 45.0974C8.4245 45.0974 7.89799 44.9219 7.54699 44.571C6.84501 43.869 6.84501 42.6407 7.54699 41.7633L13.8648 35.4461C14.5668 34.7442 15.7953 34.7442 16.6728 35.4461C17.3748 36.148 17.3748 37.3764 16.6728 38.2538L10.3549 44.571C10.0039 44.9219 9.47748 45.0974 8.95099 45.0974Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M26.1492 52.2922C25.0962 52.2922 24.2188 51.4148 24.2188 50.3619V41.5881C24.2188 40.5352 25.0962 39.6578 26.1492 39.6578C27.2021 39.6578 28.0796 40.5352 28.0796 41.5881V50.3619C28.0796 51.4148 27.2021 52.2922 26.1492 52.2922Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M43.3479 45.0974C42.8215 45.0974 42.2949 44.9219 41.9439 44.571L35.6261 38.2538C34.9241 37.5519 34.9241 36.3235 35.6261 35.4461C36.3281 34.7442 37.5566 34.7442 38.434 35.4461L44.7519 41.7633C45.4539 42.4652 45.4539 43.6936 44.7519 44.571C44.2254 44.9219 43.8744 45.0974 43.3479 45.0974Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M50.3673 28.0762H41.5926C40.5396 28.0762 39.6621 27.1988 39.6621 26.1459C39.6621 25.0931 40.5396 24.2157 41.5926 24.2157H50.3673C51.4203 24.2157 52.2978 25.0931 52.2978 26.1459C52.2978 27.1988 51.4203 28.0762 50.3673 28.0762Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M37.0301 17.0209C36.5036 17.0209 35.9771 16.8454 35.6261 16.4945C34.9241 15.7926 34.9241 14.5643 35.6261 13.6869L41.9439 7.36978C42.6459 6.66788 43.8743 6.66788 44.7518 7.36978C45.6293 8.07168 45.4538 9.3 44.7518 10.1774L38.434 16.4945C38.083 16.8454 37.5566 17.0209 37.0301 17.0209Z"}"${add_attribute("fill", color, 0)}></path></svg></span>`;
});
const Curtains = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg id="${"curtains"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)}${add_attribute("height", width, 0)} viewBox="${"0 0 24 24"}"><rect id="${"Rectangle_3243"}" data-name="${"Rectangle 3243"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} fill="${"none"}"></rect><g id="${"Group_2643"}" data-name="${"Group 2643"}" transform="${"translate(-153 -372)"}"><path id="${"Path_854"}" data-name="${"Path 854"}" d="${"M1302.2,4623.458v9.171c3.218-2.324,3.852-7.115,3.973-9.171H1302.2m0,11.252v6.748h2.974a10.628,10.628,0,0,0-.206-2.143,7.342,7.342,0,0,0-2.769-4.6m-1-12.252h6s.232,8-4.746,11.208c4.467,2.99,3.665,8.792,3.665,8.792H1301.2Z"}" transform="${"translate(-1145.202 -4248.458)"}"${add_attribute("fill", color, 0)}></path><path id="${"Path_855"}" data-name="${"Path 855"}" d="${"M1302.231,4623.458c.122,2.057.755,6.848,3.973,9.171v-9.171h-3.973m3.973,11.252a7.342,7.342,0,0,0-2.769,4.6,10.622,10.622,0,0,0-.206,2.143h2.974v-6.748m-5-12.252h6v20h-4.919s-.8-5.8,3.665-8.792C1300.973,4630.454,1301.2,4622.458,1301.2,4622.458Z"}" transform="${"translate(-1133.202 -4248.458)"}"${add_attribute("fill", color, 0)}></path></g></svg></span>`;
});
const Ac = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width * 0.79 } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 54 43"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M47.0802 28.816C45.9458 28.816 45.0949 27.9643 45.0949 26.8286C45.0949 25.693 45.9458 24.8413 47.0802 24.8413C48.4983 24.8413 49.6328 23.7057 49.6328 22.2862V6.52972C49.6328 5.11022 48.4983 3.97461 47.0802 3.97461H6.52315C5.10507 3.97461 3.97063 5.11022 3.97063 6.52972V22.2862C3.97063 23.7057 5.10507 24.8413 6.52315 24.8413C7.65762 24.8413 8.50848 25.693 8.50848 26.8286C8.50848 27.9643 7.65762 28.816 6.52315 28.816C2.97795 28.816 0 25.835 0 22.2862V6.52972C0 2.98096 2.97795 0 6.52315 0H47.0802C50.6254 0 53.6034 2.98096 53.6034 6.52972V22.2862C53.4616 25.835 50.6254 28.816 47.0802 28.816Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M17.7259 42.3011C17.1587 42.3011 16.7333 42.1591 16.3079 41.7333C15.5988 41.0235 15.5988 39.746 16.3079 38.8943C16.8751 38.3265 19.144 35.6294 16.3079 32.6484C11.9118 28.248 13.8971 23.1378 16.3079 20.8665C17.0169 20.1568 18.2932 20.1568 19.144 20.8665C19.8531 21.5763 19.8531 22.8539 19.144 23.7056C18.5768 24.2734 16.3079 26.9704 19.144 29.9514C21.5548 32.3645 22.2638 35.2036 21.2712 38.1845C20.5621 40.3138 19.2858 41.5913 19.144 41.7333C18.7186 42.1591 18.2932 42.3011 17.7259 42.3011Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M26.7998 42.3011C26.2325 42.3011 25.8071 42.1591 25.3817 41.7333C24.6727 41.0235 24.6727 39.746 25.3817 38.8943C25.9489 38.3265 28.2178 35.6294 25.3817 32.6484C22.971 30.2353 22.2619 27.3963 23.2546 24.4153C23.9636 22.286 25.2399 21.0085 25.3817 20.8665C26.0907 20.1568 27.367 20.1568 28.2178 20.8665C28.9269 21.5763 28.9269 22.8539 28.2178 23.7056C27.6506 24.2734 25.2399 26.9704 28.2178 29.9514C32.6139 34.3519 30.6286 39.4621 28.2178 41.7333C27.7924 42.1591 27.2252 42.3011 26.7998 42.3011Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M35.7354 42.3011C35.1681 42.3011 34.7427 42.1591 34.3173 41.7333C33.6082 41.0235 33.6082 39.746 34.3173 38.8943C34.8845 38.3265 37.1534 35.6294 34.3173 32.6484C31.9065 30.2353 31.1975 27.3963 32.1901 24.4153C32.8992 22.286 34.1755 21.0085 34.3173 20.8665C35.0263 20.1568 36.3026 20.1568 37.1534 20.8665C37.8625 21.5763 37.8625 22.8539 37.1534 23.7056C36.5862 24.2734 34.1755 26.9704 37.1534 29.9514C41.5495 34.3519 39.5642 39.4621 37.1534 41.7333C36.728 42.1591 36.3026 42.3011 35.7354 42.3011Z"}"${add_attribute("fill", color, 0)}></path></svg></span>`;
});
const Custom_scene = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg id="${"custom_scene"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"><rect id="${"boundingbox"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} fill="${"none"}"></rect><g id="${"Group_1376"}" data-name="${"Group 1376"}" transform="${"translate(-758 -114)"}"><path id="${"Rectangle_722"}" data-name="${"Rectangle 722"}" d="${"M4,1A3,3,0,0,0,1,4V14a3,3,0,0,0,3,3H14a3,3,0,0,0,3-3V4a3,3,0,0,0-3-3H4M4,0H14a4,4,0,0,1,4,4V14a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z"}" transform="${"translate(761 117)"}"${add_attribute("fill", color, 0)}></path><path id="${"Path_847"}" data-name="${"Path 847"}" d="${"M18,15.284a3.6,3.6,0,0,1-3.6,3.6H3.6a3.6,3.6,0,0,1-3.6-3.6S8.7,8.843,13.2,8.843,18,15.284,18,15.284Z"}" transform="${"translate(761 116.116)"}"${add_attribute("fill", color, 0)}></path><path id="${"Path_847_-_Outline"}" data-name="${"Path 847 - Outline"}" d="${"M14.4,17.884A2.6,2.6,0,0,0,17,15.311a10.362,10.362,0,0,0-.658-2.918,4.855,4.855,0,0,0-1.182-1.817,2.8,2.8,0,0,0-1.96-.732c-3.221,0-9.48,4-12.155,5.918A2.6,2.6,0,0,0,3.6,17.884H14.4m0,1H3.6a3.6,3.6,0,0,1-3.6-3.6S8.7,8.843,13.2,8.843,18,15.284,18,15.284A3.6,3.6,0,0,1,14.4,18.884Z"}" transform="${"translate(761 116.116)"}"${add_attribute("fill", color, 0)}></path><circle id="${"Ellipse_47"}" data-name="${"Ellipse 47"}" cx="${"1.8"}" cy="${"1.8"}" r="${"1.8"}" transform="${"translate(763.769 119.769)"}"${add_attribute("fill", color, 0)}></circle></g></svg></span>`;
});
const Clock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg${add_attribute("width", width, 0)}${add_attribute("height", width, 0)} viewBox="${"0 0 49 49"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><circle cx="${"24.1721"}" cy="${"24.1721"}" r="${"22.6721"}"${add_attribute("stroke", color, 0)} stroke-width="${"3"}"></circle><line x1="${"24.165"}" y1="${"1"}" x2="${"24.165"}" y2="${"6.05018"}"${add_attribute("stroke", color, 0)} stroke-width="${"2"}" stroke-linecap="${"round"}"></line><line x1="${"1"}" y1="${"24.1792"}" x2="${"6.05018"}" y2="${"24.1792"}"${add_attribute("stroke", color, 0)} stroke-width="${"2"}" stroke-linecap="${"round"}"></line><line x1="${"41.2871"}" y1="${"24.1792"}" x2="${"46.3373"}" y2="${"24.1792"}"${add_attribute("stroke", color, 0)} stroke-width="${"2"}" stroke-linecap="${"round"}"></line><path d="${"M34.4189 31.0037L24.3112 23.7018L24.3112 31.0037"}"${add_attribute("stroke", color, 0)} stroke-width="${"2"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><line x1="${"24.165"}" y1="${"42.2939"}" x2="${"24.165"}" y2="${"47.3441"}"${add_attribute("stroke", color, 0)} stroke-width="${"2"}" stroke-linecap="${"round"}"></line></svg></span>`;
});
const System = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width * 0.74 } = $$props;
  let { scale = 1 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  return `<span class="${"mx-auto"}" style="${"scale:" + escape(scale, true)}"><svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 64 47"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect x="${"7.25391"}" y="${"1.5"}" width="${"48.7821"}" height="${"30.083"}"${add_attribute("stroke", color, 0)} stroke-width="${"3"}"></rect><path d="${"M0 44.5901H63.2892"}"${add_attribute("stroke", color, 0)} stroke-width="${"3"}"></path></svg></span>`;
});
const Motion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = 45 } = $$props;
  let { height = width * 1.125 } = $$props;
  let { color = "#56483D" } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 45 51"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><mask id="${"path-1-inside-1_1160_1059"}" fill="${"white"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M28.525 0.273241C28.7883 0.592985 28.7426 1.06565 28.4228 1.32897C25.7561 3.52505 23.0622 4.00841 20.7737 3.67909C18.5168 3.3543 16.6891 2.24592 15.6738 1.29831C15.371 1.01569 15.3546 0.541096 15.6373 0.238283C15.9199 -0.0645304 16.3945 -0.0808957 16.6973 0.20173C17.5196 0.969195 19.073 1.9189 20.9874 2.19438C22.8703 2.46534 25.1377 2.09116 27.4693 0.171073C27.789 -0.092245 28.2617 -0.0465032 28.525 0.273241ZM6.44661 9.42928C6.16566 9.12492 5.69117 9.10594 5.3868 9.38689C5.08244 9.66784 5.06346 10.1423 5.34441 10.4467C6.66423 11.8765 10.6292 15.7698 16.49 17.2174C14.9279 18.3341 13.0099 19.8718 11.8733 20.7831C11.5325 21.0563 11.262 21.2732 11.0923 21.4056C10.9776 21.494 10.865 21.5915 10.7562 21.6979C6.30316 19.6413 2.62875 16.3803 1.30111 14.942C1.02015 14.6376 0.545659 14.6186 0.241294 14.8996C-0.0630718 15.1805 -0.0820517 15.655 0.198901 15.9594C1.59732 17.4743 5.32692 20.791 9.90574 22.9562C9.75672 23.3155 9.65278 23.7199 9.61284 24.1703C9.59251 24.4035 9.49721 25.13 9.37755 26.0422C9.15971 27.7029 8.86113 29.9791 8.78711 31.0152C8.78711 33.5346 12.0556 33.4455 12.3194 31.45C12.6061 29.3207 13.0305 26.8347 13.2598 25.7756C13.5121 24.6497 13.7415 23.9362 14.4411 23.4568C15.3012 22.8771 17.2394 21.4056 17.2394 21.4056L15.2095 29.7778C15.2095 29.7778 25.7605 45.909 27.6069 48.7071C29.4533 51.5053 33.9719 48.997 31.5865 45.5299C29.7744 42.899 22.2626 31.0152 22.2626 31.0152L23.8108 24.6608C23.8108 24.6608 24.0631 25.352 24.2581 25.954C24.5708 26.9183 25.7148 27.5869 26.5749 28.0896C26.6296 28.1216 26.6832 28.1529 26.7353 28.1836C27.3317 28.5292 30.7378 29.9338 32.9742 30.848C35.3367 31.8179 36.4606 28.5515 34.5109 27.838C32.8595 27.236 29.7056 25.954 28.8111 25.4523C28.5869 25.3252 28.3266 25.1593 28.0751 24.9417C36.3531 23.336 42.3367 17.8092 44.3475 15.1701C44.5985 14.8407 44.5349 14.3701 44.2054 14.119C43.8759 13.868 43.4053 13.9316 43.1543 14.2611C41.2741 16.7288 35.4471 22.1044 27.4484 23.5327C27.3484 23.5505 27.2566 23.5874 27.1761 23.639C27.1744 23.634 27.1728 23.629 27.1711 23.6241C26.9446 22.9348 26.3206 20.9384 25.6477 18.7856C25.559 18.5017 25.4694 18.2151 25.3798 17.9284C32.5611 16.684 36.8261 13.0284 38.8344 10.3926C39.0854 10.0631 39.0218 9.59249 38.6923 9.34145C38.3629 9.09042 37.8923 9.15402 37.6412 9.4835C35.7873 11.9168 31.6669 15.4759 24.5285 16.5466C24.5125 16.549 24.4968 16.5519 24.4812 16.5553C23.0351 15.4331 20.2403 15.4051 18.416 16.0734C12.1397 15.1179 7.82603 10.9237 6.44661 9.42928ZM12.3684 4.69974C12.1141 4.37278 11.6429 4.31387 11.3159 4.56818C10.989 4.82248 10.9301 5.29369 11.1844 5.62065C12.1107 6.81164 14.9525 9.1152 19.6032 10.138C19.8744 12.1618 21.6548 13.7246 23.8107 13.7246C26.1543 13.7246 28.0541 11.8779 28.0541 9.59987C28.0541 9.46935 28.0478 9.34026 28.0356 9.21284C28.1082 9.20413 28.1808 9.18456 28.2511 9.15332C31.0293 7.91854 32.7808 6.05997 33.3482 5.20883C33.578 4.86418 33.4848 4.39853 33.1402 4.16877C32.7956 3.939 32.3299 4.03213 32.1001 4.37678C31.6875 4.9957 30.1558 6.66528 27.6419 7.7826L27.625 7.79034C26.9354 6.41934 25.4865 5.4751 23.8107 5.4751C21.8148 5.4751 20.1407 6.81463 19.688 8.6193C15.4921 7.64075 13.047 5.57214 12.3684 4.69974ZM14.8197 32.7654L18.1685 38.1387L17.3198 41.695C17.3198 41.695 12.7324 47.5031 11.2071 49.454C9.45241 51.639 6.05774 49.0192 7.8927 46.4886C9.3836 44.4931 13.1911 39.3985 13.1911 39.3985L14.8197 32.7654Z"}"></path></mask><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M28.525 0.273241C28.7883 0.592985 28.7426 1.06565 28.4228 1.32897C25.7561 3.52505 23.0622 4.00841 20.7737 3.67909C18.5168 3.3543 16.6891 2.24592 15.6738 1.29831C15.371 1.01569 15.3546 0.541096 15.6373 0.238283C15.9199 -0.0645304 16.3945 -0.0808957 16.6973 0.20173C17.5196 0.969195 19.073 1.9189 20.9874 2.19438C22.8703 2.46534 25.1377 2.09116 27.4693 0.171073C27.789 -0.092245 28.2617 -0.0465032 28.525 0.273241ZM6.44661 9.42928C6.16566 9.12492 5.69117 9.10594 5.3868 9.38689C5.08244 9.66784 5.06346 10.1423 5.34441 10.4467C6.66423 11.8765 10.6292 15.7698 16.49 17.2174C14.9279 18.3341 13.0099 19.8718 11.8733 20.7831C11.5325 21.0563 11.262 21.2732 11.0923 21.4056C10.9776 21.494 10.865 21.5915 10.7562 21.6979C6.30316 19.6413 2.62875 16.3803 1.30111 14.942C1.02015 14.6376 0.545659 14.6186 0.241294 14.8996C-0.0630718 15.1805 -0.0820517 15.655 0.198901 15.9594C1.59732 17.4743 5.32692 20.791 9.90574 22.9562C9.75672 23.3155 9.65278 23.7199 9.61284 24.1703C9.59251 24.4035 9.49721 25.13 9.37755 26.0422C9.15971 27.7029 8.86113 29.9791 8.78711 31.0152C8.78711 33.5346 12.0556 33.4455 12.3194 31.45C12.6061 29.3207 13.0305 26.8347 13.2598 25.7756C13.5121 24.6497 13.7415 23.9362 14.4411 23.4568C15.3012 22.8771 17.2394 21.4056 17.2394 21.4056L15.2095 29.7778C15.2095 29.7778 25.7605 45.909 27.6069 48.7071C29.4533 51.5053 33.9719 48.997 31.5865 45.5299C29.7744 42.899 22.2626 31.0152 22.2626 31.0152L23.8108 24.6608C23.8108 24.6608 24.0631 25.352 24.2581 25.954C24.5708 26.9183 25.7148 27.5869 26.5749 28.0896C26.6296 28.1216 26.6832 28.1529 26.7353 28.1836C27.3317 28.5292 30.7378 29.9338 32.9742 30.848C35.3367 31.8179 36.4606 28.5515 34.5109 27.838C32.8595 27.236 29.7056 25.954 28.8111 25.4523C28.5869 25.3252 28.3266 25.1593 28.0751 24.9417C36.3531 23.336 42.3367 17.8092 44.3475 15.1701C44.5985 14.8407 44.5349 14.3701 44.2054 14.119C43.8759 13.868 43.4053 13.9316 43.1543 14.2611C41.2741 16.7288 35.4471 22.1044 27.4484 23.5327C27.3484 23.5505 27.2566 23.5874 27.1761 23.639C27.1744 23.634 27.1728 23.629 27.1711 23.6241C26.9446 22.9348 26.3206 20.9384 25.6477 18.7856C25.559 18.5017 25.4694 18.2151 25.3798 17.9284C32.5611 16.684 36.8261 13.0284 38.8344 10.3926C39.0854 10.0631 39.0218 9.59249 38.6923 9.34145C38.3629 9.09042 37.8923 9.15402 37.6412 9.4835C35.7873 11.9168 31.6669 15.4759 24.5285 16.5466C24.5125 16.549 24.4968 16.5519 24.4812 16.5553C23.0351 15.4331 20.2403 15.4051 18.416 16.0734C12.1397 15.1179 7.82603 10.9237 6.44661 9.42928ZM12.3684 4.69974C12.1141 4.37278 11.6429 4.31387 11.3159 4.56818C10.989 4.82248 10.9301 5.29369 11.1844 5.62065C12.1107 6.81164 14.9525 9.1152 19.6032 10.138C19.8744 12.1618 21.6548 13.7246 23.8107 13.7246C26.1543 13.7246 28.0541 11.8779 28.0541 9.59987C28.0541 9.46935 28.0478 9.34026 28.0356 9.21284C28.1082 9.20413 28.1808 9.18456 28.2511 9.15332C31.0293 7.91854 32.7808 6.05997 33.3482 5.20883C33.578 4.86418 33.4848 4.39853 33.1402 4.16877C32.7956 3.939 32.3299 4.03213 32.1001 4.37678C31.6875 4.9957 30.1558 6.66528 27.6419 7.7826L27.625 7.79034C26.9354 6.41934 25.4865 5.4751 23.8107 5.4751C21.8148 5.4751 20.1407 6.81463 19.688 8.6193C15.4921 7.64075 13.047 5.57214 12.3684 4.69974ZM14.8197 32.7654L18.1685 38.1387L17.3198 41.695C17.3198 41.695 12.7324 47.5031 11.2071 49.454C9.45241 51.639 6.05774 49.0192 7.8927 46.4886C9.3836 44.4931 13.1911 39.3985 13.1911 39.3985L14.8197 32.7654Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M28.4228 1.32897L27.4693 0.171073L27.4693 0.171074L28.4228 1.32897ZM28.525 0.273241L29.6829 -0.680317L29.6829 -0.680321L28.525 0.273241ZM20.7737 3.67909L20.5601 5.16379L20.5601 5.16379L20.7737 3.67909ZM15.6738 1.29831L14.6503 2.3949L14.6503 2.3949L15.6738 1.29831ZM15.6373 0.238283L16.7338 1.26176L16.7338 1.26176L15.6373 0.238283ZM16.6973 0.20173L15.6738 1.29831L15.6738 1.29831L16.6973 0.20173ZM20.9874 2.19438L21.201 0.709679L21.201 0.709679L20.9874 2.19438ZM27.4693 0.171073L26.5157 -0.986822L26.5157 -0.986822L27.4693 0.171073ZM5.3868 9.38689L4.36938 8.28468L4.36938 8.28468L5.3868 9.38689ZM6.44661 9.42928L5.34441 10.4467L5.34441 10.4467L6.44661 9.42928ZM5.34441 10.4467L6.44661 9.42928L6.44661 9.42928L5.34441 10.4467ZM16.49 17.2174L17.3623 18.4376C17.8388 18.097 18.0734 17.5103 17.9632 16.9352C17.853 16.36 17.4182 15.9015 16.8497 15.7611L16.49 17.2174ZM11.8733 20.7831L10.935 19.6128L10.935 19.6128L11.8733 20.7831ZM11.0923 21.4056L12.0085 22.5933L12.015 22.5882L11.0923 21.4056ZM10.7562 21.6979L10.1273 23.0597C10.6926 23.3208 11.3604 23.2055 11.8054 22.77L10.7562 21.6979ZM1.30111 14.942L0.1989 15.9594L0.198901 15.9594L1.30111 14.942ZM0.198901 15.9594L1.30111 14.942L1.30111 14.942L0.198901 15.9594ZM9.90574 22.9562L11.2913 23.5307C11.5978 22.7917 11.2703 21.9421 10.547 21.6001L9.90574 22.9562ZM9.61284 24.1703L8.1187 24.0378L8.11851 24.04L9.61284 24.1703ZM9.37755 26.0422L7.89029 25.8472L7.89029 25.8472L9.37755 26.0422ZM8.78711 31.0152L7.29092 30.9083C7.28838 30.9439 7.28711 30.9795 7.28711 31.0152L8.78711 31.0152ZM12.3194 31.45L10.8328 31.2498L10.8323 31.2534L12.3194 31.45ZM13.2598 25.7756L11.7961 25.4476L11.7938 25.4581L13.2598 25.7756ZM14.4411 23.4568L13.6027 22.2129L13.5932 22.2195L14.4411 23.4568ZM17.2394 21.4056L18.6972 21.7591C18.8467 21.1423 18.5919 20.4982 18.061 20.1506C17.53 19.803 16.8378 19.8272 16.3323 20.2109L17.2394 21.4056ZM15.2095 29.7778L13.7517 29.4243C13.6541 29.827 13.7273 30.2521 13.9541 30.5988L15.2095 29.7778ZM27.6069 48.7071L28.8589 47.881L28.8589 47.881L27.6069 48.7071ZM31.5865 45.5299L32.8222 44.6797L32.8218 44.6791L31.5865 45.5299ZM22.2626 31.0152L20.8052 30.6601C20.7089 31.0554 20.7773 31.4728 20.9947 31.8167L22.2626 31.0152ZM23.8108 24.6608L25.2199 24.1465C24.9933 23.5258 24.3873 23.1265 23.7276 23.1631C23.0679 23.1998 22.5099 23.6638 22.3535 24.3057L23.8108 24.6608ZM24.2581 25.954L22.8311 26.4162L22.8313 26.4167L24.2581 25.954ZM26.5749 28.0896L25.818 29.3847L25.818 29.3847L26.5749 28.0896ZM26.7353 28.1836L25.9746 29.4765L25.9832 29.4814L26.7353 28.1836ZM32.9742 30.848L33.5438 29.4604L33.5417 29.4595L32.9742 30.848ZM34.5109 27.838L35.0264 26.4294L35.0246 26.4287L34.5109 27.838ZM28.8111 25.4523L28.0712 26.7572L28.0774 26.7606L28.8111 25.4523ZM28.0751 24.9417L27.7894 23.4692C27.2257 23.5785 26.7738 24.0001 26.6258 24.555C26.4777 25.1098 26.6595 25.7005 27.0938 26.0762L28.0751 24.9417ZM44.3475 15.1701L45.5406 16.0792L45.5406 16.0792L44.3475 15.1701ZM44.2054 14.119L43.2963 15.3122L43.2963 15.3122L44.2054 14.119ZM43.1543 14.2611L44.3474 15.1701L44.3475 15.1701L43.1543 14.2611ZM27.4484 23.5327L27.712 25.0093L27.712 25.0093L27.4484 23.5327ZM27.1761 23.639L25.7548 24.1184C25.9023 24.5558 26.243 24.9009 26.6785 25.054C27.114 25.2072 27.5958 25.1512 27.9846 24.9024L27.1761 23.639ZM27.1711 23.6241L25.7461 24.0924L25.7472 24.0956L27.1711 23.6241ZM25.6477 18.7856L24.216 19.2331L24.216 19.2331L25.6477 18.7856ZM25.3798 17.9284L25.1236 16.4505C24.6979 16.5243 24.3246 16.778 24.0995 17.1469C23.8743 17.5157 23.8192 17.9636 23.9481 18.3761L25.3798 17.9284ZM38.8344 10.3926L40.0275 11.3016L40.0275 11.3016L38.8344 10.3926ZM38.6923 9.34145L37.7833 10.5346L37.7833 10.5346L38.6923 9.34145ZM37.6412 9.4835L38.8344 10.3926L38.8344 10.3926L37.6412 9.4835ZM24.5285 16.5466L24.306 15.0632L24.3059 15.0632L24.5285 16.5466ZM24.4812 16.5553L23.5616 17.7403C23.9116 18.0119 24.3638 18.1149 24.7969 18.0217L24.4812 16.5553ZM18.416 16.0734L18.1903 17.5563C18.4398 17.5943 18.695 17.5687 18.932 17.4819L18.416 16.0734ZM11.3159 4.56818L12.2369 5.75221L12.2369 5.7522L11.3159 4.56818ZM12.3684 4.69974L13.5524 3.77882L13.5524 3.77882L12.3684 4.69974ZM11.1844 5.62065L10.0004 6.54156L10.0004 6.54156L11.1844 5.62065ZM19.6032 10.138L21.0899 9.93875C21.0061 9.3141 20.5409 8.80841 19.9254 8.67304L19.6032 10.138ZM28.0356 9.21284L27.8569 7.72353C27.0483 7.82058 26.4649 8.54509 26.5425 9.35578L28.0356 9.21284ZM28.2511 9.15332L27.6419 7.7826L27.6419 7.7826L28.2511 9.15332ZM33.3482 5.20883L34.5963 6.04088L34.5963 6.04088L33.3482 5.20883ZM33.1402 4.16877L33.9723 2.92069L33.9723 2.92069L33.1402 4.16877ZM32.1001 4.37678L30.8521 3.54472L30.8521 3.54473L32.1001 4.37678ZM27.6419 7.7826L27.0327 6.41188C27.0271 6.41435 27.0216 6.41685 27.0161 6.41938L27.6419 7.7826ZM27.625 7.79034L26.285 8.46439C26.6479 9.18586 27.5169 9.49049 28.2508 9.15356L27.625 7.79034ZM19.688 8.6193L19.3473 10.0801C20.1446 10.266 20.9437 9.77835 21.1429 8.98426L19.688 8.6193ZM18.1685 38.1387L19.6275 38.4869C19.7206 38.0968 19.6536 37.6857 19.4415 37.3454L18.1685 38.1387ZM14.8197 32.7654L16.0927 31.972C15.7736 31.4601 15.1789 31.189 14.5832 31.2841C13.9875 31.3792 13.5068 31.8219 13.3629 32.4077L14.8197 32.7654ZM17.3198 41.695L18.4969 42.6247C18.632 42.4536 18.7282 42.2552 18.7788 42.0431L17.3198 41.695ZM11.2071 49.454L12.3767 50.3932C12.3807 50.3881 12.3848 50.383 12.3888 50.3779L11.2071 49.454ZM7.8927 46.4886L6.69105 45.5908C6.68677 45.5965 6.68254 45.6023 6.67834 45.6081L7.8927 46.4886ZM13.1911 39.3985L14.3927 40.2964C14.5131 40.1353 14.5999 39.9515 14.6479 39.7561L13.1911 39.3985ZM29.3764 2.48686C30.3356 1.69691 30.4728 0.278915 29.6829 -0.680317L27.3671 1.2268C27.1038 0.907055 27.1495 0.434391 27.4693 0.171073L29.3764 2.48686ZM20.5601 5.16379C23.254 5.55147 26.3745 4.95898 29.3764 2.48686L27.4693 0.171074C25.1378 2.09112 22.8703 2.46535 20.9874 2.19438L20.5601 5.16379ZM14.6503 2.3949C15.8586 3.52256 17.9604 4.78968 20.5601 5.16379L20.9874 2.19438C19.0731 1.91891 17.5197 0.969273 16.6973 0.201729L14.6503 2.3949ZM14.5407 -0.785196C13.6928 0.123245 13.7419 1.54702 14.6503 2.3949L16.6973 0.201731C17.0001 0.484354 17.0165 0.958946 16.7338 1.26176L14.5407 -0.785196ZM17.7208 -0.894853C16.8123 -1.74273 15.3886 -1.69363 14.5407 -0.785194L16.7338 1.26176C16.4512 1.56457 15.9766 1.58094 15.6738 1.29831L17.7208 -0.894853ZM21.201 0.709679C19.6292 0.483482 18.3499 -0.307622 17.7208 -0.894854L15.6738 1.29831C16.6892 2.24601 18.5169 3.35432 20.7737 3.67909L21.201 0.709679ZM26.5157 -0.986822C24.5192 0.657322 22.6783 0.922259 21.201 0.709679L20.7737 3.67909C23.0622 4.00842 25.7562 3.525 28.4228 1.32897L26.5157 -0.986822ZM29.6829 -0.680321C28.8929 -1.63955 27.4749 -1.77678 26.5157 -0.986822L28.4228 1.32897C28.1031 1.59229 27.6304 1.54655 27.3671 1.2268L29.6829 -0.680321ZM6.40422 10.4891C6.09986 10.77 5.62536 10.7511 5.34441 10.4467L7.54882 8.41186C6.70596 7.49876 5.28248 7.44183 4.36938 8.28468L6.40422 10.4891ZM6.44661 9.42928C6.72757 9.73365 6.70859 10.2081 6.40422 10.4891L4.36938 8.28468C3.45629 9.12754 3.39934 10.551 4.2422 11.4641L6.44661 9.42928ZM16.8497 15.7611C11.4155 14.4189 7.69693 10.7838 6.44661 9.42928L4.2422 11.4641C5.63153 12.9692 9.84275 17.1206 16.1303 18.6736L16.8497 15.7611ZM12.8115 21.9534C13.956 21.0358 15.8403 19.5257 17.3623 18.4376L15.6176 15.9971C14.0155 17.1425 12.0638 18.7077 10.935 19.6128L12.8115 21.9534ZM12.015 22.5882C12.1946 22.4481 12.475 22.2232 12.8115 21.9534L10.935 19.6128C10.59 19.8894 10.3294 20.0983 10.1696 20.223L12.015 22.5882ZM11.8054 22.77C11.8713 22.7054 11.9395 22.6465 12.0085 22.5932L10.176 20.218C10.0158 20.3416 9.85872 20.4775 9.70705 20.6259L11.8054 22.77ZM0.198901 15.9594C1.62695 17.5065 5.45574 20.9022 10.1273 23.0597L11.3852 20.3362C7.15057 18.3804 3.63054 15.2541 2.40331 13.9246L0.198901 15.9594ZM1.25871 16.0018C0.954349 16.2827 0.479855 16.2638 0.1989 15.9594L2.40331 13.9246C1.56045 13.0115 0.136969 12.9545 -0.776126 13.7974L1.25871 16.0018ZM1.30111 14.942C1.58206 15.2463 1.56308 15.7208 1.25871 16.0018L-0.776126 13.7974C-1.68922 14.6402 -1.74616 16.0637 -0.903303 16.9768L1.30111 14.942ZM10.547 21.6001C6.17887 19.5346 2.59976 16.3489 1.30111 14.942L-0.903305 16.9768C0.59487 18.5998 4.47497 22.0474 9.26453 24.3122L10.547 21.6001ZM11.107 24.3028C11.1335 24.0038 11.201 23.7485 11.2913 23.5307L8.52016 22.3816C8.3124 22.8826 8.17207 23.4361 8.1187 24.0378L11.107 24.3028ZM10.8648 26.2373C10.9807 25.3535 11.0831 24.5764 11.1072 24.3006L8.11851 24.04C8.10189 24.2306 8.01367 24.9065 7.89029 25.8472L10.8648 26.2373ZM10.2833 31.1221C10.3533 30.1425 10.6433 27.9257 10.8648 26.2373L7.89029 25.8472C7.67608 27.4801 7.36899 29.8156 7.29092 30.9083L10.2833 31.1221ZM10.8323 31.2534C10.8262 31.3001 10.8148 31.3207 10.8102 31.3282C10.8047 31.3373 10.7949 31.3499 10.7745 31.3647C10.7263 31.3997 10.6359 31.433 10.5305 31.4276C10.4306 31.4225 10.3841 31.3878 10.3697 31.3731C10.3621 31.3655 10.3458 31.3469 10.3289 31.3028C10.3114 31.2571 10.2871 31.167 10.2871 31.0152H7.28711C7.28711 31.9867 7.61174 32.8493 8.23416 33.4801C8.84082 34.095 9.628 34.3856 10.3782 34.4238C11.8235 34.4972 13.5495 33.5905 13.8065 31.6465L10.8323 31.2534ZM11.7938 25.4581C11.553 26.5699 11.1225 29.0983 10.8328 31.2498L13.806 31.6501C14.0897 29.5431 14.5079 27.0995 14.7258 26.0931L11.7938 25.4581ZM13.5932 22.2195C12.356 23.0672 12.0413 24.3533 11.7961 25.4476L14.7235 26.1036C14.9829 24.9461 15.1269 24.8052 15.289 24.6942L13.5932 22.2195ZM17.2394 21.4056C16.3323 20.2109 16.3323 20.2109 16.3323 20.2109C16.3323 20.2109 16.3323 20.2109 16.3323 20.2109C16.3323 20.211 16.3322 20.211 16.3321 20.2111C16.3319 20.2113 16.3316 20.2115 16.3312 20.2118C16.3303 20.2125 16.329 20.2135 16.3272 20.2148C16.3237 20.2175 16.3183 20.2215 16.3113 20.2269C16.2972 20.2375 16.2763 20.2534 16.2494 20.2738C16.1954 20.3146 16.1172 20.3737 16.0205 20.4465C15.8271 20.5922 15.5605 20.7924 15.2676 21.0102C14.672 21.4532 13.9995 21.9456 13.6028 22.213L15.2794 24.7007C15.7428 24.3884 16.4695 23.8551 17.058 23.4174C17.3571 23.1949 17.6288 22.991 17.8257 22.8426C17.9242 22.7684 18.0041 22.7081 18.0595 22.6662C18.0872 22.6452 18.1088 22.6288 18.1235 22.6177C18.1309 22.6121 18.1365 22.6078 18.1404 22.6049C18.1423 22.6034 18.1438 22.6023 18.1448 22.6015C18.1453 22.6011 18.1457 22.6008 18.146 22.6006C18.1461 22.6005 18.1462 22.6005 18.1463 22.6004C18.1463 22.6004 18.1464 22.6003 18.1464 22.6003C18.1464 22.6003 18.1464 22.6003 17.2394 21.4056ZM16.6672 30.1312L18.6972 21.7591L15.7816 21.0522L13.7517 29.4243L16.6672 30.1312ZM28.8589 47.881C27.9377 46.4849 24.8404 41.7557 21.9708 37.3716C20.5366 35.1805 19.1601 33.0767 18.1421 31.5208C17.6332 30.7428 17.2138 30.1018 16.9217 29.6552C16.7757 29.432 16.6614 29.2573 16.5837 29.1385C16.5449 29.0791 16.5151 29.0336 16.4951 29.003C16.4851 28.9877 16.4775 28.9761 16.4724 28.9684C16.4699 28.9645 16.468 28.9616 16.4667 28.9596C16.4661 28.9586 16.4656 28.9579 16.4653 28.9574C16.4651 28.9572 16.465 28.957 16.4649 28.9569C16.4648 28.9567 16.4648 28.9567 15.2095 29.7778C13.9541 30.5988 13.9542 30.5989 13.9543 30.599C13.9543 30.5991 13.9545 30.5993 13.9546 30.5996C13.9549 30.6001 13.9554 30.6008 13.9561 30.6018C13.9573 30.6037 13.9593 30.6067 13.9618 30.6105C13.9669 30.6183 13.9745 30.6299 13.9845 30.6452C14.0045 30.6758 14.0342 30.7213 14.0731 30.7807C14.1508 30.8996 14.2651 31.0742 14.4112 31.2975C14.7033 31.7441 15.1227 32.3852 15.6317 33.1632C16.6497 34.7193 18.0264 36.8232 19.4607 39.0146C22.3283 43.3957 25.4297 48.1312 26.3549 49.5333L28.8589 47.881ZM30.3507 46.3802C30.7694 46.9887 30.7908 47.4053 30.7525 47.6277C30.7121 47.8619 30.5744 48.0708 30.3496 48.2212C30.1172 48.3767 29.8345 48.4386 29.5819 48.3978C29.3576 48.3617 29.0933 48.2363 28.8589 47.881L26.3549 49.5333C27.7963 51.7176 30.3577 51.8253 32.0177 50.7147C32.8552 50.1544 33.5152 49.2611 33.7089 48.1372C33.9046 47.0017 33.5963 45.8047 32.8222 44.6797L30.3507 46.3802ZM22.2626 31.0152C20.9947 31.8167 20.9947 31.8167 20.9948 31.8168C20.9948 31.8169 20.9949 31.817 20.995 31.8172C20.9952 31.8176 20.9956 31.8181 20.9961 31.8189C20.997 31.8203 20.9983 31.8225 21.0002 31.8254C21.0038 31.8311 21.0092 31.8397 21.0164 31.851C21.0307 31.8736 21.0519 31.9072 21.0797 31.9511C21.1352 32.039 21.2169 32.168 21.3215 32.3332C21.5306 32.6636 21.8313 33.1384 22.1979 33.7164C22.9308 34.8724 23.9272 36.4412 24.9803 38.0925C27.0776 41.381 29.4262 45.0378 30.3511 46.3807L32.8218 44.6791C31.9347 43.3911 29.6214 39.7905 27.5097 36.4794C26.4584 34.8309 25.4635 33.2644 24.7314 32.1099C24.3654 31.5326 24.0651 31.0585 23.8563 30.7287C23.7519 30.5638 23.6705 30.435 23.6151 30.3475C23.5874 30.3037 23.5662 30.2702 23.552 30.2477C23.5449 30.2365 23.5395 30.2279 23.5359 30.2223C23.5341 30.2194 23.5328 30.2173 23.5319 30.2158C23.5314 30.2151 23.5311 30.2146 23.5308 30.2142C23.5307 30.2141 23.5307 30.2139 23.5306 30.2138C23.5305 30.2138 23.5305 30.2137 22.2626 31.0152ZM22.3535 24.3057L20.8052 30.6601L23.72 31.3703L25.2682 25.0159L22.3535 24.3057ZM25.6851 25.4918C25.582 25.1733 25.4653 24.8363 25.376 24.5829C25.331 24.4553 25.2923 24.347 25.2647 24.2704C25.2509 24.232 25.2399 24.2015 25.2322 24.1803C25.2284 24.1698 25.2254 24.1615 25.2233 24.1558C25.2223 24.153 25.2214 24.1507 25.2209 24.1492C25.2206 24.1484 25.2204 24.1478 25.2202 24.1473C25.2201 24.1471 25.22 24.1469 25.22 24.1468C25.22 24.1467 25.2199 24.1466 25.2199 24.1466C25.2199 24.1466 25.2199 24.1465 25.2199 24.1465C25.2199 24.1465 25.2199 24.1465 23.8108 24.6608C22.4018 25.1752 22.4018 25.1752 22.4018 25.1751C22.4018 25.1751 22.4018 25.1751 22.4018 25.1751C22.4018 25.1751 22.4018 25.1751 22.4018 25.1751C22.4018 25.1752 22.4018 25.1752 22.4018 25.1753C22.4019 25.1756 22.4021 25.1759 22.4022 25.1765C22.4026 25.1776 22.4033 25.1793 22.4041 25.1816C22.4058 25.1864 22.4085 25.1936 22.4119 25.2031C22.4188 25.2221 22.429 25.2502 22.4419 25.2861C22.4677 25.3578 22.5042 25.4599 22.5467 25.5804C22.6323 25.8231 22.7393 26.1327 22.8311 26.4162L25.6851 25.4918ZM27.3318 26.7946C26.8856 26.5338 26.4847 26.2962 26.1556 26.0295C25.817 25.7551 25.711 25.5716 25.685 25.4913L22.8313 26.4167C23.1179 27.3007 23.7402 27.9336 24.2669 28.3603C24.8029 28.7947 25.4041 29.1428 25.818 29.3847L27.3318 26.7946ZM27.4959 26.8908C27.4416 26.8588 27.3862 26.8264 27.3318 26.7946L25.818 29.3847C25.873 29.4168 25.9247 29.447 25.9747 29.4764L27.4959 26.8908ZM33.5417 29.4595C32.4245 29.0028 31.0203 28.4257 29.8228 27.9205C29.2234 27.6677 28.6817 27.4353 28.256 27.2463C28.0429 27.1516 27.8645 27.0703 27.7253 27.0044C27.6559 26.9714 27.5999 26.9441 27.5567 26.9222C27.5352 26.9113 27.5185 26.9026 27.506 26.896C27.4999 26.8927 27.4952 26.8901 27.4919 26.8883C27.4886 26.8865 27.4872 26.8856 27.4874 26.8858L25.9832 29.4814C26.3857 29.7147 27.5035 30.1981 28.6567 30.6846C29.8704 31.1967 31.2875 31.779 32.4066 32.2365L33.5417 29.4595ZM33.9954 29.2466C34.0396 29.2628 34.0403 29.2722 34.0256 29.2571C34.0119 29.243 34.0054 29.2286 34.0041 29.2247C34.0037 29.2235 34.0089 29.2389 34.0069 29.2724C34.005 29.3061 33.9962 29.3471 33.9786 29.3888C33.9408 29.4779 33.8915 29.5095 33.8758 29.5165C33.8691 29.5195 33.8511 29.5268 33.811 29.5264C33.7692 29.5261 33.6818 29.517 33.5438 29.4604L32.4045 32.2356C33.327 32.6143 34.2692 32.6247 35.0944 32.2578C35.893 31.9029 36.4458 31.2551 36.7406 30.5597C37.0328 29.8704 37.1095 29.0458 36.847 28.2667C36.571 27.4475 35.9446 26.7654 35.0264 26.4294L33.9954 29.2466ZM28.0774 26.7606C29.0929 27.3302 32.3571 28.6494 33.9972 29.2473L35.0246 26.4287C33.3618 25.8226 30.3184 24.5778 29.5448 24.144L28.0774 26.7606ZM27.0938 26.0762C27.4448 26.3798 27.7954 26.6007 28.0712 26.7572L29.551 24.1475C29.3785 24.0497 29.2084 23.9388 29.0564 23.8072L27.0938 26.0762ZM43.1543 14.2611C41.3027 16.6914 35.6143 21.9514 27.7894 23.4692L28.3607 26.4143C37.092 24.7206 43.3708 18.927 45.5406 16.0792L43.1543 14.2611ZM43.2963 15.3122C42.9669 15.0612 42.9033 14.5906 43.1543 14.2611L45.5406 16.0792C46.2937 15.0908 46.1029 13.679 45.1145 12.9259L43.2963 15.3122ZM44.3475 15.1701C44.0964 15.4996 43.6258 15.5632 43.2963 15.3122L45.1145 12.9259C44.126 12.1728 42.7142 12.3636 41.9612 13.352L44.3475 15.1701ZM27.712 25.0093C36.1779 23.4976 42.3074 17.8477 44.3474 15.1701L41.9612 13.352C40.2409 15.6099 34.7162 20.7111 27.1847 22.0561L27.712 25.0093ZM27.9846 24.9024C27.9022 24.9551 27.8093 24.992 27.712 25.0093L27.1847 22.056C26.8875 22.1091 26.611 22.2197 26.3676 22.3755L27.9846 24.9024ZM25.7472 24.0956C25.7497 24.1033 25.7522 24.1109 25.7548 24.1184L28.5974 23.1595C28.5966 23.1571 28.5958 23.1548 28.5951 23.1525L25.7472 24.0956ZM24.216 19.2331C24.8862 21.3773 25.5151 23.3895 25.7461 24.0924L28.5961 23.1558C28.3741 22.48 27.755 20.4995 27.0794 18.3381L24.216 19.2331ZM23.9481 18.3761C24.0377 18.6627 24.1273 18.9492 24.216 19.2331L27.0794 18.3381C26.9907 18.0542 26.9011 17.7676 26.8114 17.4808L23.9481 18.3761ZM25.6359 19.4064C33.2267 18.091 37.8134 14.2077 40.0275 11.3016L37.6412 9.4835C35.8388 11.8492 31.8955 15.277 25.1236 16.4505L25.6359 19.4064ZM40.0275 11.3016C40.7806 10.3132 40.5899 8.90141 39.6014 8.14831L37.7833 10.5346C37.4538 10.2836 37.3902 9.81297 37.6412 9.4835L40.0275 11.3016ZM39.6014 8.14831C38.613 7.39521 37.2012 7.58599 36.4481 8.57443L38.8344 10.3926C38.5834 10.722 38.1128 10.7856 37.7833 10.5346L39.6014 8.14831ZM36.4481 8.57443C34.8065 10.729 31.0208 14.056 24.306 15.0632L24.751 18.03C32.3131 16.8957 36.7681 13.1046 38.8344 10.3926L36.4481 8.57443ZM24.3059 15.0632C24.2587 15.0703 24.2119 15.0789 24.1655 15.0889L24.7969 18.0217C24.7816 18.025 24.7663 18.0277 24.7511 18.03L24.3059 15.0632ZM18.932 17.4819C19.6306 17.2259 20.5779 17.0871 21.5043 17.1404C22.4559 17.1952 23.1731 17.4388 23.5616 17.7403L25.4008 15.3702C24.3432 14.5496 22.94 14.2181 21.6766 14.1454C20.388 14.0712 19.0257 14.2525 17.9 14.6649L18.932 17.4819ZM5.34441 10.4467C6.79246 12.0154 11.3996 16.5225 18.1903 17.5563L18.6418 14.5905C12.8799 13.7133 8.85961 9.83188 7.54882 8.41186L5.34441 10.4467ZM12.2369 5.7522C11.9099 6.00651 11.4387 5.94761 11.1844 5.62065L13.5524 3.77882C12.7895 2.79794 11.3759 2.62124 10.395 3.38415L12.2369 5.7522ZM12.3684 4.69974C12.6227 5.0267 12.5638 5.4979 12.2369 5.75221L10.395 3.38415C9.41415 4.14706 9.23745 5.56068 10.0004 6.54156L12.3684 4.69974ZM19.9254 8.67304C15.5773 7.71676 13.0563 5.5841 12.3684 4.69974L10.0004 6.54156C11.1652 8.03919 14.3277 10.5136 19.281 11.603L19.9254 8.67304ZM23.8107 12.2246C22.3835 12.2246 21.2583 11.1954 21.0899 9.93875L18.1165 10.3373C18.4906 13.1282 20.9262 15.2246 23.8107 15.2246V12.2246ZM26.5541 9.59987C26.5541 11.0097 25.3662 12.2246 23.8107 12.2246V15.2246C26.9423 15.2246 29.5541 12.7461 29.5541 9.59987H26.5541ZM26.5425 9.35578C26.5501 9.43578 26.5541 9.51717 26.5541 9.59987H29.5541C29.5541 9.42153 29.5455 9.24474 29.5288 9.0699L26.5425 9.35578ZM27.6419 7.7826C27.7099 7.75238 27.7826 7.73245 27.8569 7.72353L28.2144 10.7022C28.4339 10.6758 28.6517 10.6167 28.8603 10.524L27.6419 7.7826ZM32.1001 4.37678C31.6875 4.99571 30.1558 6.66528 27.6419 7.7826L28.8603 10.524C31.9028 9.17179 33.8741 7.12423 34.5963 6.04088L32.1001 4.37678ZM32.3082 5.41684C31.9635 5.18707 31.8704 4.72142 32.1001 4.37678L34.5963 6.04088C35.2856 5.00694 35.0062 3.60999 33.9723 2.92069L32.3082 5.41684ZM33.3482 5.20884C33.1184 5.55347 32.6528 5.64661 32.3082 5.41684L33.9723 2.92069C32.9383 2.2314 31.5414 2.51079 30.8521 3.54472L33.3482 5.20884ZM28.2511 9.15332C31.0293 7.91854 32.7808 6.05998 33.3482 5.20883L30.8521 3.54473C30.5943 3.93143 29.2824 5.41202 27.0327 6.41188L28.2511 9.15332ZM28.2508 9.15356L28.2677 9.14582L27.0161 6.41938L26.9992 6.42712L28.2508 9.15356ZM23.8107 6.9751C24.9147 6.9751 25.8478 7.59533 26.285 8.46439L28.965 7.11629C28.0229 5.24335 26.0583 3.9751 23.8107 3.9751V6.9751ZM21.1429 8.98426C21.4257 7.85695 22.4921 6.9751 23.8107 6.9751V3.9751C21.1375 3.9751 18.8557 5.77231 18.2331 8.25434L21.1429 8.98426ZM11.1844 5.62065C12.0984 6.7958 14.8578 9.03308 19.3473 10.0801L20.0287 7.1585C16.1264 6.24843 13.9955 4.34848 13.5524 3.77882L11.1844 5.62065ZM19.4415 37.3454L16.0927 31.972L13.5467 33.5588L16.8955 38.9321L19.4415 37.3454ZM18.7788 42.0431L19.6275 38.4869L16.7094 37.7905L15.8608 41.3468L18.7788 42.0431ZM12.3888 50.3779C13.1491 49.4054 14.6752 47.4683 16.0132 45.7718C16.6818 44.924 17.3027 44.1372 17.7565 43.5624C17.9834 43.2749 18.1686 43.0405 18.2969 42.8779C18.3611 42.7966 18.4111 42.7333 18.4451 42.6903C18.4621 42.6688 18.475 42.6524 18.4837 42.6414C18.4881 42.6358 18.4914 42.6317 18.4936 42.6289C18.4947 42.6275 18.4955 42.6264 18.4961 42.6257C18.4964 42.6254 18.4966 42.6251 18.4967 42.6249C18.4968 42.6248 18.4968 42.6248 18.4969 42.6247C18.4969 42.6247 18.4969 42.6247 17.3198 41.695C16.1427 40.7652 16.1427 40.7653 16.1426 40.7653C16.1426 40.7653 16.1425 40.7654 16.1425 40.7655C16.1423 40.7657 16.1421 40.7659 16.1418 40.7663C16.1413 40.767 16.1404 40.7681 16.1393 40.7695C16.1371 40.7723 16.1338 40.7765 16.1294 40.782C16.1207 40.793 16.1077 40.8095 16.0907 40.831C16.0567 40.874 16.0067 40.9374 15.9425 41.0187C15.814 41.1814 15.6288 41.416 15.4018 41.7035C14.9478 42.2787 14.3266 43.0658 13.6577 43.914C12.3207 45.6092 10.7904 47.5516 10.0254 48.5301L12.3888 50.3779ZM6.67834 45.6081C6.00547 46.536 5.75479 47.5685 5.90727 48.5558C6.05586 49.5178 6.57075 50.3319 7.24408 50.8925C7.91431 51.4504 8.80175 51.8063 9.75274 51.767C10.7395 51.7263 11.6781 51.263 12.3767 50.3932L10.0375 48.5148C9.85871 48.7374 9.71499 48.766 9.6291 48.7696C9.50743 48.7746 9.33188 48.727 9.16348 48.5868C8.99818 48.4492 8.89879 48.2705 8.87212 48.0978C8.84935 47.9504 8.86244 47.7065 9.10705 47.3691L6.67834 45.6081ZM13.1911 39.3985C11.9896 38.5005 11.9896 38.5005 11.9896 38.5005C11.9895 38.5006 11.9895 38.5006 11.9894 38.5007C11.9893 38.5009 11.9892 38.5011 11.9889 38.5014C11.9885 38.502 11.9878 38.503 11.9869 38.5042C11.985 38.5066 11.9823 38.5103 11.9787 38.5152C11.9714 38.5249 11.9606 38.5393 11.9465 38.5582C11.9182 38.596 11.8766 38.6517 11.8231 38.7233C11.7161 38.8665 11.5615 39.0733 11.3714 39.3277C10.9911 39.8365 10.4686 40.5357 9.89947 41.2973C8.76123 42.8204 7.43656 44.593 6.69105 45.5908L9.09435 47.3864C9.83974 46.3887 11.1643 44.6163 12.3025 43.0932C12.8717 42.3316 13.3942 41.6324 13.7744 41.1236C13.9646 40.8692 14.1191 40.6624 14.2261 40.5192C14.2797 40.4476 14.3213 40.3919 14.3495 40.3541C14.3637 40.3352 14.3744 40.3208 14.3817 40.3111C14.3853 40.3063 14.3881 40.3026 14.3899 40.3001C14.3908 40.2989 14.3915 40.298 14.392 40.2974C14.3922 40.297 14.3924 40.2968 14.3925 40.2967C14.3925 40.2966 14.3926 40.2965 14.3926 40.2965C14.3926 40.2964 14.3927 40.2964 13.1911 39.3985ZM13.3629 32.4077L11.7344 39.0408L14.6479 39.7561L16.2764 33.123L13.3629 32.4077Z"}"${add_attribute("fill", color, 0)} mask="${"url(#path-1-inside-1_1160_1059)"}"></path></svg>`;
});
const Adapter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#000" } = $$props;
  let { width = 50 } = $$props;
  let { height = width * 1.6 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  return `<svg width="${escape(width, true) + "vw"}" height="${escape(height, true) + "vw"}" viewBox="${"0 0 23 37"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><g clip-path="${"url(#clip0_642_791)"}"><path d="${"M19.0819 32.1651H3.85011C2.81448 32.1651 1.82129 31.735 1.08898 30.9694C0.356675 30.2039 -0.0546875 29.1656 -0.0546875 28.0829V4.08213C-0.0546875 2.99947 0.356675 1.96119 1.08898 1.19564C1.82129 0.430083 2.81448 0 3.85011 0H19.0819C20.1175 0 21.1107 0.430083 21.843 1.19564C22.5753 1.96119 22.9867 2.99947 22.9867 4.08213V28.0829C22.9867 29.1656 22.5753 30.2039 21.843 30.9694C21.1107 31.735 20.1175 32.1651 19.0819 32.1651ZM3.85011 2.44636C3.43384 2.44634 3.03437 2.61826 2.73873 2.92461C2.44309 3.23097 2.27518 3.64697 2.27153 4.08213V28.0829C2.27518 28.5181 2.44309 28.9341 2.73873 29.2405C3.03437 29.5468 3.43384 29.7187 3.85011 29.7187H19.0819C19.4982 29.7187 19.8976 29.5468 20.1933 29.2405C20.4889 28.9341 20.6568 28.5181 20.6605 28.0829V4.08213C20.6568 3.64697 20.4889 3.23097 20.1933 2.92461C19.8976 2.61826 19.4982 2.44634 19.0819 2.44636H3.85011Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M21.8239 5.47192H1.16406V7.91832H21.8239V5.47192Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M9.41633 30.9492H7.07617V37.0001H9.41633V30.9492Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M15.9241 30.9492H13.584V37.0001H15.9241V30.9492Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M13.4738 20.3384H9.52734V22.7848H13.4738V20.3384Z"}"${add_attribute("fill", color, 0)}></path></g><defs><clipPath id="${"clip0_642_791"}"><rect width="${escape(width, true) + "vw"}" height="${escape(height, true) + "vw"}" fill="${"white"}"></rect></clipPath></defs></svg>`;
});
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function forOwn(object, iteratee) {
  if (object) {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }
  return object;
}
function isObject(subject) {
  return subject !== null && typeof subject === "object";
}
function isEqualDeep(subject1, subject2) {
  if (Array.isArray(subject1) && Array.isArray(subject2)) {
    return subject1.length === subject2.length && !subject1.some((elm, index) => !isEqualDeep(elm, subject2[index]));
  }
  if (isObject(subject1) && isObject(subject2)) {
    const keys1 = Object.keys(subject1);
    const keys2 = Object.keys(subject2);
    return keys1.length === keys2.length && !keys1.some((key) => {
      return !Object.prototype.hasOwnProperty.call(subject2, key) || !isEqualDeep(subject1[key], subject2[key]);
    });
  }
  return subject1 === subject2;
}
function merge(object, source) {
  const merged = object;
  forOwn(source, (value, key) => {
    if (Array.isArray(value)) {
      merged[key] = value.slice();
    } else if (isObject(value)) {
      merged[key] = merge(isObject(merged[key]) ? merged[key] : {}, value);
    } else {
      merged[key] = value;
    }
  });
  return merged;
}
function slice(arrayLike, start, end) {
  return Array.prototype.slice.call(arrayLike, start, end);
}
function apply(func) {
  return func.bind.apply(func, [null].concat(slice(arguments, 1)));
}
function typeOf(type, subject) {
  return typeof subject === type;
}
apply(typeOf, "function");
apply(typeOf, "string");
apply(typeOf, "undefined");
const Splide_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "options", "splide", "extensions", "transition", "hasTrack", "go", "sync"]);
  let { class: className = void 0 } = $$props;
  let { options = {} } = $$props;
  let { splide = void 0 } = $$props;
  let { extensions = void 0 } = $$props;
  let { transition = void 0 } = $$props;
  let { hasTrack = true } = $$props;
  createEventDispatcher();
  let root;
  let prevOptions = merge({}, options);
  function go(control) {
    splide?.go(control);
  }
  function sync(target) {
    splide?.sync(target);
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.splide === void 0 && $$bindings.splide && splide !== void 0)
    $$bindings.splide(splide);
  if ($$props.extensions === void 0 && $$bindings.extensions && extensions !== void 0)
    $$bindings.extensions(extensions);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.hasTrack === void 0 && $$bindings.hasTrack && hasTrack !== void 0)
    $$bindings.hasTrack(hasTrack);
  if ($$props.go === void 0 && $$bindings.go && go !== void 0)
    $$bindings.go(go);
  if ($$props.sync === void 0 && $$bindings.sync && sync !== void 0)
    $$bindings.sync(sync);
  {
    if (splide && !isEqualDeep(prevOptions, options)) {
      splide.options = options;
      prevOptions = merge({}, prevOptions);
    }
  }
  return `

<div${spread(
    [
      {
        class: escape_attribute_value(classNames("splide", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", root, 0)}>${hasTrack ? `${validate_component(SplideTrack, "SplideTrack").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}` : `${slots.default ? slots.default({}) : ``}`}</div>`;
});
const SplideTrack = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classNames("splide__track", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}><ul class="${"splide__list"}">${slots.default ? slots.default({}) : ``}</ul></div>`;
});
const SplideSlide = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<li${spread(
    [
      {
        class: escape_attribute_value(classNames("splide__slide", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</li>`;
});
const css$b = {
  code: ".mobTabVdo4.svelte-ngjj5v{position:relative}.mobContent4.svelte-ngjj5v{margin:20vw auto}.mob4Icon.svelte-ngjj5v{margin:auto 3vw auto 0}.mobHead4.svelte-ngjj5v,.mobTitle4.svelte-ngjj5v{font-family:'Playfair Display', serif}.mobHead4.svelte-ngjj5v{color:#56483D;font-size:15vw;text-align:center}.mobTitle4.svelte-ngjj5v{color:#46392F}.mobV4.svelte-ngjj5v{width:100%;border-radius:8vw;margin:5vw auto 3vw}.mobDesc4.svelte-ngjj5v,.mtDesc4.svelte-ngjj5v,.mobTitleDesc4.svelte-ngjj5v{font-family:'Raleway', sans-serif;color:#56483D;text-align:center}.mobTitleDesc4.svelte-ngjj5v{text-align:left;color:#282828;font-weight:300}.mobDesc4.svelte-ngjj5v{font-size:6vw;font-weight:400;margin-top:5vw }.mtDesc4.svelte-ngjj5v{font-size:6vw;font-weight:0;margin:10vw 5vw 5vw}.mobCollapse4.svelte-ngjj5v{width:85%;margin:15vw auto 5vw}.mobTab4.svelte-ngjj5v{padding:7vw}h2.svelte-ngjj5v{margin:0}",
  map: null
};
const MobSec4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active = 0;
  let ele;
  let arr = [
    {
      title: "Smart Lights",
      desc: "When smart tech makes your light design, transform your space with a single tap"
    },
    {
      title: "Smart Curtains",
      desc: "Integrate curtains & blinds into your scenes and experience the magic of ambience unfold"
    },
    {
      title: "Smart Climate",
      desc: "Assign the right temperature for every mood to elevate your living experience."
    },
    {
      title: "Smart Scenes",
      desc: "Breathe life into your mood by transforming the space with smart scenes."
    },
    {
      title: "Smart Schedules",
      desc: "Smart schedules that understand your daily needs and takes care of them for you"
    },
    {
      title: "Smart Media",
      desc: "Enhance the potential of your scene by integrating music and media into the ambience."
    },
    {
      title: "Motion Sensor",
      desc: "Smart Sense intuitively equips your home with convenience and security"
    }
  ];
  let vdoMap = {
    1: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Lights/Compressed/Smart+Lighting_1080_1.mp4",
    2: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Curtains/Compressed/smart+curtains_1080_1.mp4",
    3: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Lights/Compressed/Smart+Lighting_1080_1.mp4",
    4: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Scenes/Compressed/Smart+Scenes_1080_1.mp4",
    5: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Schedules/Compressed/Smart+Schedules_1080_2.mp4",
    6: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Media/Compressed/Smart+Media_1080_1.mp4",
    7: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Sensors/Compressed/Motion+Sensor_1080_2.mp4"
  };
  $$result.css.add(css$b);
  return `

<div class="${"mobContent4 svelte-ngjj5v"}"${add_attribute("this", ele, 0)}><div class="${"mob4"}"><h1 class="${"mobHead4 svelte-ngjj5v"}">Intelligent Spaces</h1>
        <p class="${"mobDesc4 svelte-ngjj5v"}">A home that senses</p>
        <div class="${"mtDesc4 svelte-ngjj5v"}">Experience the sheer
            convenience of smart living throught automated routines and sensory intelligence.
        </div>
        <div class="${"mobCollapse4 svelte-ngjj5v"}">${each(arr, (tb, i) => {
    return `<div class="${"mobTab4 svelte-ngjj5v"}" style="${"background-color: " + escape(i % 2 == 0 ? "#C2B0A4" : "#D5C7BD", true) + "; border-radius:" + escape(i == 0 ? "6vw 6vw 0 0" : i == 6 ? "0 0 6vw 6vw" : "", true)}"><h2 class="${"mobTitle4 d-flex align-items-center svelte-ngjj5v"}"><span class="${"mob4Icon svelte-ngjj5v"}">${i == 0 ? `<span class="${""}">${validate_component(Sun, "Sun").$$render($$result, { color: "#56483D", width: "10vw" }, {}, {})}
                                </span>` : `${i == 1 ? `${validate_component(Curtains, "Curtains").$$render($$result, { color: "#56483D", width: "10vw" }, {}, {})}` : `${i == 2 ? `${validate_component(Ac, "Ac").$$render($$result, { color: "#56483D", width: "9vw" }, {}, {})}` : `${i == 3 ? `${validate_component(Custom_scene, "Scene").$$render($$result, { color: "#56483D", width: "10vw" }, {}, {})}` : `${i == 4 ? `${validate_component(Clock, "Clock").$$render($$result, { color: "#56483D", width: "10vw" }, {}, {})}` : `${i == 5 ? `${validate_component(System, "System").$$render($$result, { color: "#56483D", width: "10vw" }, {}, {})}` : `${i == 6 ? `${validate_component(Motion, "Motion").$$render($$result, { color: "#56483D", width: "8vw" }, {}, {})}` : ``}`}`}`}`}`}`}
                        </span><span>${escape(tb.title)}</span></h2>
                    ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: active == i }, {}, {
      default: () => {
        return `<div class="${"mobTabVdo4 svelte-ngjj5v"}"><video${add_attribute("src", vdoMap[i + 1], 0)} preload="${"auto"}" autoplay playsinline muted class="${"mobV4 svelte-ngjj5v"}"></video></div>
                        <p class="${"mobTitleDesc4 svelte-ngjj5v"}">${escape(tb.desc)}</p>
                    `;
      }
    })}
                </div>`;
  })}</div></div>
</div>`;
});
const css$a = {
  code: ".mobVdiv5.svelte-vdop95{position:relative}.mobContent5.svelte-vdop95{margin:20vw auto}.mobTitle5.svelte-vdop95{font-family:'Playfair Display', serif;color:#46392F}.mobDesc5.svelte-vdop95{font-family:'Raleway', sans-serif;color:#56483D;font-weight:100;font-size:15px;padding:3vw}.mobV5.svelte-vdop95{width:100%;border-radius:10vw;margin:10vw auto 5vw}.collTab5.svelte-vdop95{padding:5vw;background-color:#E3DDD9;width:85%;margin:1vw auto 0}h1.svelte-vdop95{font-size:25px}",
  map: null
};
const MobSec5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active = 0;
  let ele;
  let obj = [
    {
      title: "Smart Console",
      desc: "The smart console is a beautifully designed and feature packed, in-wall smart control system that provides an unparalleled home automation experience for premium and luxury residential spaces."
    },
    {
      title: "Smart Wizard",
      desc: "Experience true mobility with the Scene Wizard, an exquisitely designed portable room controller. Transform your living experience with a single click."
    },
    {
      title: "Smart App",
      desc: "Control from anywhere. Create unique scenes, define your ambience, schedule your routines, control your devices and elevate your living experience with the Keus smart app."
    },
    {
      title: "Smart Voice",
      desc: "Experience a smart home at your command. The perfect automation experience is just a shout away."
    }
  ];
  let vdoMap = {
    1: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Console/Compressed/Smart+Console_3.mp4",
    2: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Wizard/Compressed/scene+wizard_1.mp4",
    3: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+App/Compressed/Smart+App_1080_1.mp4",
    4: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Smart+Voices/Compressed/Smart+Voices_2.mp4"
  };
  $$result.css.add(css$a);
  return `

<div class="${"mobContent5 svelte-vdop95"}"${add_attribute("this", ele, 0)}><div class="${"mob5"}"><div class="${"mobCollapse5"}"><div class="${"collTab5 svelte-vdop95"}" style="${"border-radius: 8vw 8vw 0 0;"}"><h1 class="${"mobTitle5 text-center svelte-vdop95"}">Intuitive Interfaces
                </h1></div>
            ${each(obj, (o, i) => {
    return `<div class="${"collTab5 svelte-vdop95"}" style="${"border-radius:" + escape(i == 3 ? "0 0 8vw 8vw" : "", true)}"><h1 class="${"mobTitle5 svelte-vdop95"}">${escape(o.title)}
                        ${active != i ? `<span class="${"mob5Icon float-end"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faCircleChevronDown, size: ".8x" }, {}, {})}
                            </span>` : ``}</h1>
                    ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: active == i }, {}, {
      default: () => {
        return `<div class="${"mobVdiv5 svelte-vdop95"}"><video${add_attribute("src", vdoMap[i + 1], 0)} muted preload="${"auto"}" playsinline autoplay class="${"mobV5 svelte-vdop95"}"></video></div>
                        <p class="${"mobDesc5 svelte-vdop95"}">${escape(o.desc)}</p>
                    `;
      }
    })}
                </div>`;
  })}</div></div>
</div>`;
});
const css$9 = {
  code: "h1.svelte-1kix3wp{margin:0}.mobV3.svelte-1kix3wp{width:100%;height:70vw;object-fit:cover;margin:5vw auto 3vw;border-radius:10vw}.mob3Icon.svelte-1kix3wp{margin:0 5vw 0 0}.mobHead3.svelte-1kix3wp,.mobDesc3.svelte-1kix3wp{text-align:center}.mobHead3.svelte-1kix3wp{color:#56483D;margin:10vw auto 5vw;font-size:15vw}.mobDesc3.svelte-1kix3wp{font-size:6vw;font-weight:0;margin:10vw 5vw}.mobHead3.svelte-1kix3wp,.mobt3.svelte-1kix3wp{font-family:'Playfair Display', serif}.mobDesc3.svelte-1kix3wp,.mobd3.svelte-1kix3wp{font-family:'Raleway', sans-serif;color:#56483D}.mob3.svelte-1kix3wp{padding:10vw 5vw}.mobVdiv3.svelte-1kix3wp{padding:2vw}.mobColTab3.svelte-1kix3wp{padding:5vw}",
  map: null
};
const MobSection3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active = 0;
  let lactive = 2;
  let ele;
  let arr = [
    {
      title: "Day Scene",
      desc: "Lighting: 50%, Art Accent: 10% | Curtains: Open |  AC: Off"
    },
    {
      title: "Relax",
      desc: "Lighting:  50%, Art Accent: 10%, Curtains: Open, AC: off"
    },
    {
      title: "Night",
      desc: "Lighting:  50%, Art Accent: 10%, Curtains: Open, AC: off"
    }
  ];
  let vdoMap = {
    12: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Ambience+Control/Compressed/Day+to+Relax_1.mp4",
    31: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Ambience+Control/Compressed/Night+to+Day_1.mp4",
    23: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Ambience+Control/Compressed/Relax+to+Night_1.mp4",
    32: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Ambience+Control/Compressed/Night+to+Relax_1.mp4",
    21: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Ambience+Control/Compressed/Relax+to+Day_1.mp4",
    13: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Ambience+Control/Compressed/Relax+to+Day_1.mp4"
  };
  const getVdo = () => {
    let lpv = lactive + 1;
    let ppv = active + 1;
    return `${lpv}${ppv}`;
  };
  $$result.css.add(css$9);
  return `

<div class="${"mobContent3"}"${add_attribute("this", ele, 0)}><div class="${"mob3 svelte-1kix3wp"}"><h1 class="${"mobHead3 svelte-1kix3wp"}">Ambience Control
        </h1>
        <p class="${"mobDesc3 svelte-1kix3wp"}">True convergence of lights, climate, curtains and media
        </p>
        <div class="${"mobCollapseDiv3"}">${each(arr, (o, i) => {
    return `<div class="${"mobColTab3 svelte-1kix3wp"}" style="${"background-color: " + escape(i % 2 == 0 ? "#C2B0A4" : "#D5C7BD", true) + "; border-radius:" + escape(i == 0 ? "8vw 8vw 0 0" : i == 2 ? "0 0 8vw 8vw" : "", true)}"><h1 class="${"mobt3 svelte-1kix3wp"}"><span class="${"mob3Icon svelte-1kix3wp"}">${i == 0 ? `${validate_component(Day, "Day").$$render($$result, { color: "#56483D", width: "12vw" }, {}, {})}` : `${i == 1 ? `${validate_component(Relax, "Relax").$$render($$result, { color: "#56483D", width: "12vw" }, {}, {})}` : `${validate_component(Night, "Night").$$render($$result, { color: "#56483D", width: "12vw" }, {}, {})}`}`}</span>
                        ${escape(o.title)}</h1>
                    ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: active == i }, {}, {
      default: () => {
        return `<div class="${"mobVdiv3 svelte-1kix3wp"}"><video${add_attribute("src", vdoMap[getVdo()], 0)} class="${"mobV3 svelte-1kix3wp"}" preload="${"auto"}" autoplay playsinline muted></video></div>
                        <p class="${"mobd3 svelte-1kix3wp"}">${escape(o.desc)}</p>
                    `;
      }
    })}
                </div>`;
  })}</div></div>
</div>`;
});
const css$8 = {
  code: ".mobHead6.svelte-18yji9l{font-family:'Playfair Display', serif;font-size:14vw;margin:15vw auto}.mobDesc6.svelte-18yji9l,.mobd6.svelte-18yji9l{font-family:'Raleway', sans-serif;font-weight:100;font-size:6vw;margin:5vw auto}.mobd6.svelte-18yji9l{padding:3vw;font-size:5vw}.mobHead6.svelte-18yji9l,.mobd6.svelte-18yji9l,.mobDesc6.svelte-18yji9l{text-align:center}.mob6.svelte-18yji9l{padding:10vw 5vw}.mobImage6.svelte-18yji9l{width:200%;object-fit:fill;margin:0 -100vw}.mimg6.svelte-18yji9l{width:80vw;height:80vw;overflow:hidden;margin:auto;position:relative;border-radius:10vw}",
  map: null
};
const MobSec6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$8);
  return `<div class="${"mobContent6"}"><div class="${"mob6 text-center svelte-18yji9l"}"><h1 class="${"mobHead6 svelte-18yji9l"}">Meet the smart console</h1>
        <p class="${"mobDesc6 svelte-18yji9l"}">The only switch system your home needs.</p>
        <p class="${"mobd6 svelte-18yji9l"}">A home becomes an aesthetic marvel when every single element comes together to define its character. Such exclusive homes deserve the most beautiful consoles.</p>
        <div class="${"mimg6 svelte-18yji9l"}"><img class="${"mobImage6 svelte-18yji9l"}" src="${"images/console.png"}" alt="${"console image"}"></div></div>
</div>`;
});
const css$7 = {
  code: ".mob7.svelte-7w8n2u{color:#56483D;padding:15vw 10vw}.mobHead7.svelte-7w8n2u{font-size:14vw;font-family:'Playfair Display', serif;text-align:center}.mobd7.svelte-7w8n2u,.mobTitle7.svelte-7w8n2u{font-family:'Source Sans Pro', sans-serif}.mobd7.svelte-7w8n2u{font-size:5vw}.mobTitle7.svelte-7w8n2u{margin:8vw auto 0}.mimg7.svelte-7w8n2u{width:180%}",
  map: null
};
const MobSec7 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let obj = [
    {
      title: "Out of the box",
      desc: "Ready to use"
    },
    {
      title: "Wall or table top",
      desc: "You decide"
    },
    {
      title: "Easy sync",
      desc: "With the Keus app"
    },
    {
      title: "Total Control",
      desc: "Scens, climate and curtains"
    }
  ];
  $$result.css.add(css$7);
  return `<div class="${"mobContent7"}"><div class="${"mob7 svelte-7w8n2u"}"><h1 class="${"mobHead7 svelte-7w8n2u"}">Ambience in you palm</h1>
        <div class="${"mobCon7"}">${each(obj, (o, i) => {
    return `<h1 class="${"mobTitle7 svelte-7w8n2u"}">${escape(o.title)}</h1>
                <p class="${"mobd7 svelte-7w8n2u"}">${escape(o.desc)}</p>`;
  })}</div>
        <div class="${"mobi7"}"><img src="${"images/wizard.png"}" alt="${"wizard image"}" class="${"mimg7 svelte-7w8n2u"}"></div></div>
</div>`;
});
const css$6 = {
  code: ".mobDesc8-1.svelte-1xnsipe{font-size:2.5vw}.mobHead8.svelte-1xnsipe{font-family:'Playfair Display', serif;font-size:14vw;text-align:center}.mobDesc8.svelte-1xnsipe{text-align:center;font-size:6vw;margin:6vw auto}.mobd8.svelte-1xnsipe,.mobTitle8.svelte-1xnsipe,.mobDesc8.svelte-1xnsipe{font-family:'Source Sans Pro', sans-serif}.mobd8.svelte-1xnsipe{font-size:5vw;font-weight:100;opacity:.8}.mobTitle8.svelte-1xnsipe{margin:10vw auto 0}.mobContent8.svelte-1xnsipe{margin:20vw 10vw}.mobImg8.svelte-1xnsipe{overflow:hidden;position:relative;border-radius:10vw;margin:10vw auto 15vw}.mimg8.svelte-1xnsipe{width:130%;margin:0 -18vw}.mvimg8.svelte-1xnsipe{position:absolute;width:25%;bottom:55%;right:0%}.mimg8-2.svelte-1xnsipe{width:50vw;margin:2.5vw auto}.mimg8-1.svelte-1xnsipe{width:50vw;margin:5vw auto 2.5vw}.mimg8-3.svelte-1xnsipe{width:50vw;margin:2.5vw auto}",
  map: null
};
const MobSec8 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let obj = [
    {
      title: "Easy control",
      desc: "of scenes, devices and schedules"
    },
    {
      title: "Easy setup",
      desc: "with Apple Home, Alexa and Google Home"
    },
    {
      title: "Easy commands",
      desc: "for a complete smart home experience"
    }
  ];
  $$result.css.add(css$6);
  return `<div class="${"mobContent8 svelte-1xnsipe"}"><div class="${"mob8"}"><h1 class="${"mobHead8 svelte-1xnsipe"}">Smart home at your command
        </h1>
        <p class="${"mobDesc8 svelte-1xnsipe"}">Home that listens</p>
        <div class="${"mobImg8 svelte-1xnsipe"}"><img src="${"images/bedRoom.png"}" alt="${"bedroom image"}" class="${"mimg8 svelte-1xnsipe"}">
            <img src="${"images/voice.png"}" alt="${"voice control image"}" class="${"mvimg8 svelte-1xnsipe"}"></div>
        ${each(obj, (o, i) => {
    return `<h1 class="${"mobTitle8 svelte-1xnsipe"}">${escape(o.title)}</h1>
            <p class="${"mobd8 svelte-1xnsipe"}">${escape(o.desc)}</p>`;
  })}
        <div class="${"mobImg8-1"}"><img src="${"images/googleHome.png"}" alt="${"google home image"}" class="${"mimg8-1 svelte-1xnsipe"}"></div>
        <div class="${"mobImg8-2"}"><img src="${"images/alexa.png"}" alt="${"alexa image"}" class="${"mimg8-2 svelte-1xnsipe"}"></div>
        <div class="${"mobImg8-3"}"><img src="${"images/hkit.png"}" alt="${"homekit image"}" class="${"mimg8-3 svelte-1xnsipe"}"></div>
        <p class="${"mobDesc8-1 svelte-1xnsipe"}">Amazon, Alexa and all related logo are trademarks of amazon.com, Inc. or its affiliates Google, Google play Google home and other marks are trademarks of Google LLC., Apple homekit is the trade mark of Apple INC.
        </p></div>
</div>`;
});
const css$5 = {
  code: ".mobContent9.svelte-n7db7{color:#56483D;padding:25vw 10vw}.mob9Icon.svelte-n7db7{margin:0 5vw 0 0}.mobHead9.svelte-n7db7{font-family:'Playfair Display', serif;font-size:13vw;text-align:center}.mobDesc9.svelte-n7db7{text-align:center;font-size:6vw;margin:10vw auto}.mobd9.svelte-n7db7,.mbTitle9.svelte-n7db7,.mobDesc9.svelte-n7db7{font-family:'Source Sans Pro', sans-serif}.mobd9.svelte-n7db7{font-size:5.5vw;padding:3vw;text-align:center;opacity:.8;margin:0vw auto 15vw}.mbTitle9.svelte-n7db7{font-size:6.5vw;margin-top:10vw;padding:0 3vw}.mimg9.svelte-n7db7{width:250%;margin:0 -35vw}",
  map: null
};
const MobSec9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$5);
  return `<div class="${"mobContent9 svelte-n7db7"}"><div class="${"mob9"}"><h1 class="${"mobHead9 svelte-n7db7"}">Control from any where</h1>
        <p class="${"mobDesc9 svelte-n7db7"}">A home that responds</p>

        <p class="${"mobd9 svelte-n7db7"}">Access your smart home from anywhere in the world. Create unique scenes, define your ambience, schedules your routines, control all devices and elevate your living experience with the Keus smart app.</p>

        <h2 class="${"mbTitle9 svelte-n7db7"}"><span class="${"mob9Icon svelte-n7db7"}">${validate_component(Sun, "Sun").$$render($$result, { width: "12vw", color: "#56483D" }, {}, {})}</span>
            Light Control
        </h2>
        <h2 class="${"mbTitle9 svelte-n7db7"}"><span class="${"mob9Icon svelte-n7db7"}">${validate_component(Adapter, "Adapter").$$render($$result, { width: 7.5, color: "#56483D" }, {}, {})}</span>
            Appliance Control
        </h2>
        <h2 class="${"mbTitle9 svelte-n7db7"}"><span class="${"mob9Icon svelte-n7db7"}">${validate_component(Ac, "Ac").$$render($$result, { width: "11vw", color: "#56483D" }, {}, {})}</span>
            Climate Control
        </h2>
        <h2 class="${"mbTitle9 svelte-n7db7"}"><span class="${"mob9Icon svelte-n7db7"}">${validate_component(Curtains, "Curtains").$$render($$result, { width: "11vw", color: "#56483D" }, {}, {})}</span>
            Curtain Control
        </h2>
        <h2 class="${"mbTitle9 svelte-n7db7"}"><span class="${"mob9Icon svelte-n7db7"}">${validate_component(System, "System").$$render($$result, { width: "12vw", color: "#56483D" }, {}, {})}</span>
            Media Control
        </h2>
        <div class="${"mobImg9"}"><img src="${"images/app.png"}" alt="${"app image"}" class="${"mimg9 svelte-n7db7"}"></div></div>
</div>`;
});
const css$4 = {
  code: ".playBtn10.svelte-1r49ouj{position:absolute;bottom:48vw;right:15vw;z-index:999}.mobContent10.svelte-1r49ouj{padding:20vw 0}.mobVdiv10.svelte-1r49ouj{width:85vw;height:85vw;margin:5vw auto;overflow:hidden;border-radius:60px}.mobV10.svelte-1r49ouj{width:100%;object-fit:cover}.mobHead10.svelte-1r49ouj,.mobTitle10.svelte-1r49ouj{font-family:'Playfair Display', serif;text-align:center;font-size:10vw}.mobd10.svelte-1r49ouj,.mobDesc10.svelte-1r49ouj{font-family:'Raleway', sans-serif;text-align:center}.mobDesc10.svelte-1r49ouj{margin:3vw auto 5vw}",
  map: null
};
const MobSec10 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  let ele;
  let tabs = [
    "baba",
    "neelesh",
    "priyanka",
    "sravanthiKollur",
    "suprajaRao",
    "vaishnaviLinga",
    "naveenPanuganti"
  ];
  let arr = [
    {
      title: "Baba Shashank",
      desc: "Space Fiction Studio",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Baba+Shashank+Final.m4v"
    },
    {
      title: "S Neelesh Kumar",
      desc: "23 deg Design Shift",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/S+Neelesh+Kumar+3.m4v"
    },
    {
      title: "Priyanka Ghattamaneni",
      desc: "Studio Emerald",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Priyanka+Ghattamaneni+F.m4v"
    },
    {
      title: "Sravanthi Kolluri",
      desc: "Principal Architect EssEnn Architects",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Sravanthi+1080+1.m4v"
    },
    {
      title: "Supraja Rao",
      desc: "Design House",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Supraja+Rao+Hd+1080.m4v"
    },
    {
      title: "Vishnavi Linga",
      desc: "VAL Atelier",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Vaishnavi+Linga.m4v"
    },
    {
      title: "Naveen Panuganti",
      desc: "Principal Architect Naveen Associates",
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Naveen+Panuganti+1080+1.m4v"
    }
  ];
  $$result.css.add(css$4);
  return `

<div class="${"mobContent10 svelte-1r49ouj"}"${add_attribute("this", ele, 0)}><div class="${"mob10"}"><h1 class="${"mobHead10 svelte-1r49ouj"}">Architect Speak</h1>
        <p class="${"mobDesc10 svelte-1r49ouj"}">Love from the industry</p>
        <div class="${"mobSlider10"}">${validate_component(Splide_1, "Splide").$$render(
    $$result,
    {
      options: { type: "loop" },
      hasTrack: false
    },
    {},
    {
      default: () => {
        return `${validate_component(SplideTrack, "SplideTrack").$$render($$result, {}, {}, {
          default: () => {
            return `${each(arr, (o, i) => {
              return `${validate_component(SplideSlide, "SplideSlide").$$render($$result, {}, {}, {
                default: () => {
                  return `<div class="${"mobSlide10"}"><div class="${"mobVdiv10 svelte-1r49ouj"}">${`<span class="${"playBtn10 svelte-1r49ouj"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faPlayCircle,
                      size: innerWidth * 6e-3 + "x",
                      color: "#827f7e"
                    },
                    {},
                    {}
                  )}
                                        </span>`}
                                    <video${add_attribute("src", o?.link, 0)} preload="${"auto"}" loop playsinline poster="${"videos/" + escape(tabs[i], true) + "/poster.jpg"}" class="${"mobV10 svelte-1r49ouj"}"></video></div>
                                <h1 class="${"mobTitle10 svelte-1r49ouj"}">${escape(o.title)}</h1>
                                <p class="${"mobd10 svelte-1r49ouj"}">${escape(o.desc)}</p></div>
                        `;
                }
              })}`;
            })}`;
          }
        })}
                <div class="${"splide__arrows"}" style="${"position:relative;bottom:40px;"}"><button class="${"splide__arrow splide__arrow--prev p-mob11"}"><span class="${"p11"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faChevronRight }, {}, {})}</span></button>
                    <button class="${"splide__arrow splide__arrow--next n-mob11"}"><span class="${"n11"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faChevronRight }, {}, {})}</span></button></div>`;
      }
    }
  )}</div></div>
</div>`;
});
const css$3 = {
  code: ".n-mob11.svelte-5fifnr,.p-mob11.svelte-5fifnr{position:absolute;top:46%}.playBtn.svelte-5fifnr{position:absolute;bottom:5vw;right:7vw}.mobSlideDiv11.svelte-5fifnr{margin:15vw auto}.mobContent11.svelte-5fifnr{padding:10vw 6vw}.mobVdiv11.svelte-5fifnr{width:85vw;height:85vw;border-radius:50px;position:relative;overflow:hidden;margin:10vw auto}.mobV11.svelte-5fifnr{width:100%;height:85vw;object-fit:cover}.mobHead11.svelte-5fifnr,.mobTitle11.svelte-5fifnr{font-family:'Playfair Display', serif;text-align:center;font-size:10vw}.mobd11.svelte-5fifnr,.mobDesc11.svelte-5fifnr,.mobdd11.svelte-5fifnr{font-family:'Raleway', sans-serif;text-align:center}.mobdd11.svelte-5fifnr{min-height:58vw;display:flex;align-items:center;padding:2.5vw}",
  map: null
};
const MobSec11 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  let ele;
  let arr = [
    {
      title: "Villa No.70",
      desc: "Cyprus Palms",
      dd: "See how the best-in-class automation solutions from Keus, elevated the living experience in this stunningly designed villa. Watch how the various smart controls like the Keus app, smart consoles and scene wizards come together to transform and provide true convenience to this gorgeous home.",
      stars: 5,
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Home+Videos/Compressed+Videos/Cyprus+Palms+Final+Comp.m4v"
    },
    {
      title: "Villa No. 39",
      desc: "Aditya Casagrande",
      dd: "Watch how the Keus smart home solution elevated and transformed the living experience of this beautifully designed super luxurious residence of over 15000sft.",
      stars: 5,
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Home+Videos/Compressed+Videos/Villa+No-39.m4v"
    },
    {
      title: "Villa No. 12",
      desc: "Aditya Casagrande",
      dd: "One of the best examples of how the living experience of a home comes alive and amplifies because of deep home automation.",
      stars: 5,
      link: "https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Home+Videos/Compressed+Videos/Brijesh+House+Villa+No-13.m4v"
    }
  ];
  $$result.css.add(css$3);
  return `

<div class="${"mobContent11 svelte-5fifnr"}"${add_attribute("this", ele, 0)}><div class="${"mob11"}"><h1 class="${"mobHead11 svelte-5fifnr"}">Smart Home Tours</h1>
        <p class="${"mobDesc11 svelte-5fifnr"}">walkthroughs of our recent installations</p>
        <div class="${"mobSlideDiv11 svelte-5fifnr"}">${validate_component(Splide_1, "Splide").$$render(
    $$result,
    {
      options: { type: "loop" },
      hasTrack: false
    },
    {},
    {
      default: () => {
        return `${validate_component(SplideTrack, "SplideTrack").$$render($$result, {}, {}, {
          default: () => {
            return `${each(arr, (o, i) => {
              return `${validate_component(SplideSlide, "SplideSlide").$$render($$result, {}, {}, {
                default: () => {
                  return `<h1 class="${"mobTitle11 svelte-5fifnr"}">${escape(o.title)}</h1>
                            <p class="${"mobd11 svelte-5fifnr"}">${escape(o.desc)}</p>
                            <p class="${"mobdd11 mobdd11-2 svelte-5fifnr"}">${escape(o.dd)}</p>
                            <div class="${"mobStars11 text-center"}"><span class="${"mobStar"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faStar,
                      color: o.stars >= 1 ? "#BEBDBD" : "#e5e5e5"
                    },
                    {},
                    {}
                  )}</span>
                                <span class="${"mobStar"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faStar,
                      color: o.stars >= 2 ? "#BEBDBD" : "#e5e5e5"
                    },
                    {},
                    {}
                  )}</span>
                                <span class="${"mobStar"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faStar,
                      color: o.stars >= 3 ? "#BEBDBD" : "#e5e5e5"
                    },
                    {},
                    {}
                  )}</span>
                                <span class="${"mobStar"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faStar,
                      color: o.stars >= 4 ? "#BEBDBD" : "#e5e5e5"
                    },
                    {},
                    {}
                  )}</span>
                                <span class="${"mobStar"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faStar,
                      color: o.stars >= 5 ? "#BEBDBD" : "#e5e5e5"
                    },
                    {},
                    {}
                  )}</span></div>
                            <div class="${"mobVdiv11 svelte-5fifnr"}">${`<span class="${"playBtn svelte-5fifnr"}">${validate_component(Fa, "Fa").$$render(
                    $$result,
                    {
                      icon: faPlayCircle,
                      size: innerWidth * 6e-3 + "x",
                      color: "#827f7e"
                    },
                    {},
                    {}
                  )}
                                    </span>`}
                                <video${add_attribute("src", o?.link, 0)} preload="${"auto"}" playsinline poster="${"videos/homes/" + escape(i + 1, true) + "/poster.jpg"}" class="${"mobV11 svelte-5fifnr"}"></video></div>
                        `;
                }
              })}`;
            })}`;
          }
        })}
                <div class="${"splide__arrows"}" style="${""}"><button class="${"splide__arrow splide__arrow--prev p-mob11 svelte-5fifnr"}"><span class="${"p11"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faChevronRight }, {}, {})}</span></button>
                    <button class="${"splide__arrow splide__arrow--next n-mob11 svelte-5fifnr"}"><span class="${"n11"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faChevronRight }, {}, {})}</span></button></div>`;
      }
    }
  )}</div></div>
</div>`;
});
const css$2 = {
  code: ".mobContent12.svelte-1c1jgim{padding:20vw 5vw 0}.mobHead12.svelte-1c1jgim{color:#56483D}.mobHead12.svelte-1c1jgim{font-family:'Playfair Display', serif;text-align:center;font-size:10vw}",
  map: null
};
const MobSec12 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  $$result.css.add(css$2);
  return `<div class="${"mobContent12 svelte-1c1jgim"}"><div class="${"mob12"}"><h1 class="${"mobHead12 svelte-1c1jgim"}">Smart Home Projects</h1>
        
        <div class="${"mobImages12"}">${each(arr, (o) => {
    return `<img src="${"images/img" + escape(o, true) + ".png"}" alt="${"img" + escape(o, true)}" class="${"col-6 img12"}">`;
  })}</div></div>
</div>`;
});
const css$1 = {
  code: ".icon13.svelte-bpqixb{margin-left:8px}.icon13.svelte-bpqixb{color:#fff;text-decoration:none}.submit.svelte-bpqixb{color:#fff;border:none;background-color:#8fbec4;font-size:5vw;width:100%;margin:3vw auto 10vw;padding:1vw}.inp.svelte-bpqixb{background-color:#373737;color:#78848f;border:none;display:block;width:100%;margin:2vw auto;height:10vw;font-size:4vw}.inp.svelte-bpqixb:focus{outline:none}.input.svelte-bpqixb{width:100%;color:#78848f;margin:2vw auto}.mobContent13.svelte-bpqixb{background-color:#202020;color:#fff;margin:25vw auto 0}.mob13.svelte-bpqixb{padding:0 15vw}.iconP.svelte-bpqixb{margin:0}.mobHead13.svelte-bpqixb{font-family:'Playfair Display', serif;text-align:center;font-size:9vw}.mobFoot13.svelte-bpqixb{background-color:#000;padding:2vw;min-height:10vw}.mobDesc13.svelte-bpqixb,.mobFootDesc13.svelte-bpqixb{font-family:'Raleway', sans-serif;text-align:center;font-size:2.6vw;margin:50vw auto 0}.mobDesc13.svelte-bpqixb{margin:3vw auto 8vw}.mobFootDesc13.svelte-bpqixb{display:flex;align-items:center;justify-content:center;margin:3vw auto 3vw}",
  map: null
};
const MobSec13 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_booked;
  $$unsubscribe_booked = subscribe(booked, (value) => value);
  let ele;
  let FName;
  let Mobile;
  let Email;
  let ptype;
  let psize;
  let soc;
  let formproptyp = [
    "Independent Home",
    "Gated Villa",
    "Apartment",
    "Office",
    "Architect/Interior Designer",
    "Builder",
    "PMC",
    "Others"
  ];
  let formpropsz = ["1501-2000", "2001-3000", "3001-4000", "4001-5000", "5001-7000", "7001-above"];
  let formstgcon = ["Early Stage", "Close To Handover", "Electrical In Progress", "Ready To Move"];
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `

<div class="${"mobContent13 svelte-bpqixb"}"${add_attribute("this", ele, 0)}><div class="${"mob13 svelte-bpqixb"}"><div class="${"left13 float-end"}"><h1 class="${"mobHead13 svelte-bpqixb"}">Elevate your living experience</h1>
            <p class="${"mobDesc13 svelte-bpqixb"}">Register for a exclusive smart home demo at our custom <br>
                built studio apartment.
            </p></div>
        <div class="${"form13"}"><form class="${"formContent13"}"><input class="${"inp svelte-bpqixb"}" type="${"text"}" placeholder="${"  Full name"}" required${add_attribute("value", FName, 0)}>
                <input class="${"inp svelte-bpqixb"}" type="${"tel"}" placeholder="${"  Mobile"}" required${add_attribute("value", Mobile, 0)}>
                <input class="${"inp svelte-bpqixb"}" type="${"email"}" placeholder="${"  Email"}" required${add_attribute("value", Email, 0)}>
                <div class="${"input svelte-bpqixb"}">${validate_component(Select, "Select").$$render(
      $$result,
      {
        required: true,
        items: formproptyp,
        containerStyles: "background-color:#373737;border:none;height:2.5vw",
        inputStyles: "height:100%;font-size:3.1vw;",
        placeholder: "  Property type",
        value: ptype
      },
      {
        value: ($$value) => {
          ptype = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>
                <div class="${"input svelte-bpqixb"}">${validate_component(Select, "Select").$$render(
      $$result,
      {
        items: formpropsz,
        containerStyles: "background-color:#373737;border:none;height:2.5vw",
        inputStyles: "height:100%;font-size:3.1vw;",
        placeholder: "  Property size",
        value: psize
      },
      {
        value: ($$value) => {
          psize = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>
                <div class="${"input svelte-bpqixb"}">${validate_component(Select, "Select").$$render(
      $$result,
      {
        items: formstgcon,
        containerStyles: "background-color:#373737;border:none;height:2.5vw",
        inputStyles: "height:100%;font-size:3.1vw;",
        placeholder: "  Stage of construction",
        value: soc
      },
      {
        value: ($$value) => {
          soc = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>
                <button type="${"submit"}" class="${"submit svelte-bpqixb"}">${`Book your appointment`}</button></form></div>
        </div>
    <div class="${"mobFoot13 svelte-bpqixb"}"><p class="${"mobFootDesc13 svelte-bpqixb"}">Copyright © 2020 KEUS All rights reserved  
        </p>
        <p class="${"iconP text-center svelte-bpqixb"}"><span class="${"icons13"}"><a href="${""}" class="${"icon13 svelte-bpqixb"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faInstagram, size: "2x" }, {}, {})}</a>
                <a href="${""}" class="${"icon13 svelte-bpqixb"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faFacebook, size: "2x" }, {}, {})}</a>
                <a href="${""}" class="${"icon13 svelte-bpqixb"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faLinkedin, size: "2x" }, {}, {})}</a>
                <a href="${""}" class="${"icon13 svelte-bpqixb"}">${validate_component(Fa, "Fa").$$render($$result, { icon: faEnvelope, size: "2x" }, {}, {})}</a></span></p></div>
</div>`;
  } while (!$$settled);
  $$unsubscribe_booked();
  return $$rendered;
});
const AwardLeafLeft = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = 24 } = $$props;
  let { color = "black" } = $$props;
  let height = width * 2.3333333333;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 26 59"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M22.5914 45.8845C22.4812 45.8077 22.3563 45.7544 22.2245 45.728C22.0927 45.7016 21.9569 45.7027 21.8256 45.7311C21.6943 45.7595 21.5702 45.8146 21.4611 45.893C21.352 45.9715 21.2602 46.0716 21.1915 46.1871C20.0173 48.1592 19.6788 49.9221 19.6748 51.2964C19.2419 50.9241 18.8155 50.5445 18.4028 50.1509C18.31 50.062 18.2005 49.9923 18.0807 49.9458C17.9609 49.8993 17.8331 49.8768 17.7046 49.8796C17.4451 49.8854 17.1986 49.994 17.0191 50.1816C16.8397 50.3691 16.7422 50.6203 16.7479 50.8798C16.7537 51.1393 16.8623 51.3858 17.0498 51.5653C17.6034 52.0949 18.1788 52.6054 18.7688 53.098C17.393 53.4721 15.6377 54.3436 13.9676 56.3175C13.882 56.4187 13.8179 56.5363 13.7791 56.6631C13.7403 56.7899 13.7277 56.9233 13.7421 57.0551C13.7564 57.1869 13.7974 57.3145 13.8625 57.4299C13.9277 57.5454 14.0156 57.6465 14.121 57.727C15.2033 58.4682 16.4859 58.8619 17.7976 58.8556H17.9376C18.5552 58.8415 19.1627 58.6965 19.7201 58.43C20.2774 58.1636 20.7719 57.7819 21.1707 57.3101C21.8156 56.5488 22.1751 55.5865 22.1873 54.5887C23.1072 54.263 23.8866 53.6301 24.3943 52.7967C24.7208 52.2603 24.9301 51.6609 25.0084 51.0379C25.0867 50.4149 25.0322 49.7824 24.8485 49.1819C24.457 47.875 23.6681 46.7225 22.5914 45.8845ZM19.678 56.045C19.4585 56.305 19.1864 56.5154 18.8795 56.6624C18.5727 56.8094 18.2381 56.8896 17.8979 56.8977C17.3701 56.9092 16.8443 56.8302 16.3431 56.6641C17.8842 55.2548 19.3595 54.8879 20.2223 54.8065C20.1684 55.2643 19.9788 55.6956 19.678 56.045ZM22.723 51.7778C22.4974 52.155 22.1674 52.4588 21.7729 52.6526C21.5758 51.7989 21.452 50.2695 22.2791 48.3473C22.5869 48.7752 22.8227 49.2505 22.977 49.7546C23.0798 50.0906 23.1103 50.4447 23.0666 50.7934C23.0228 51.1421 22.9057 51.4776 22.723 51.7778Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M15.8184 48.8332C16.7853 48.7181 17.6827 48.2724 18.3585 47.5715C18.7948 47.1195 19.1301 46.5801 19.3422 45.9889C19.5543 45.3976 19.6384 44.7681 19.589 44.1419C19.4901 42.78 18.9713 41.4822 18.1041 40.4274C18.0134 40.3282 17.9032 40.2487 17.7804 40.194C17.6576 40.1393 17.5248 40.1105 17.3903 40.1094H17.3823C17.2491 40.1094 17.1174 40.1365 16.9951 40.1892C16.8729 40.2418 16.7626 40.3189 16.6712 40.4156C15.4034 41.6988 14.5093 43.3031 14.085 45.0563C13.6976 44.4908 13.3248 43.9154 12.9755 43.3288C12.9109 43.2162 12.8245 43.1175 12.7214 43.0385C12.6183 42.9596 12.5005 42.902 12.3749 42.869C12.2493 42.836 12.1184 42.8284 11.9898 42.8466C11.8613 42.8647 11.7376 42.9083 11.626 42.9747C11.5144 43.0411 11.4172 43.1291 11.34 43.2335C11.2627 43.3379 11.207 43.4566 11.1762 43.5827C11.1453 43.7088 11.1398 43.8398 11.1601 43.9681C11.1803 44.0964 11.2259 44.2193 11.2942 44.3298C11.759 45.1111 12.2609 45.8753 12.7891 46.6202C11.3681 46.6842 9.4752 47.1485 7.4292 48.696C7.32345 48.776 7.23506 48.8766 7.16941 48.9918C7.10375 49.107 7.06218 49.2344 7.04725 49.3661C7.03231 49.4979 7.0443 49.6313 7.0825 49.7583C7.1207 49.8852 7.18431 50.0031 7.26947 50.1048C8.19596 51.1009 9.4118 51.781 10.7455 52.0492C11.3501 52.173 11.9741 52.1666 12.5761 52.0303C13.178 51.894 13.7439 51.631 14.2362 51.2589C15.0299 50.6592 15.5895 49.8013 15.8184 48.8332ZM17.2604 42.762C17.4689 43.2489 17.5964 43.7666 17.6381 44.2946C17.6661 44.6443 17.6195 44.996 17.5014 45.3264C17.3833 45.6568 17.1965 45.9583 16.9532 46.2112C16.6513 46.5285 16.2635 46.7509 15.8373 46.8513C15.8277 45.9761 16.0366 44.4555 17.2604 42.762ZM13.0579 49.6967C12.7872 49.9013 12.4761 50.0459 12.1453 50.1211C11.8144 50.1962 11.4713 50.2002 11.1389 50.1326C10.6194 50.0252 10.1219 49.8305 9.66747 49.5568C11.4791 48.5233 12.9989 48.4949 13.8568 48.6074C13.7058 49.0424 13.4274 49.422 13.0579 49.6967Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M8.72066 43.2934C9.63412 42.9133 10.3861 42.226 10.8466 41.3504C11.0358 41.377 11.2266 41.3907 11.4176 41.3912C12.1954 41.3902 12.9579 41.1744 13.6209 40.7677C14.1554 40.4394 14.6139 40.001 14.9658 39.4817C15.3176 38.9624 15.5548 38.3741 15.6615 37.7559C15.9016 36.4112 15.7204 35.0252 15.1426 33.7875C15.0796 33.6689 14.9927 33.5646 14.8876 33.481C14.7824 33.3974 14.6612 33.3364 14.5314 33.3017C14.4016 33.267 14.2661 33.2595 14.1333 33.2794C14.0004 33.2994 13.8732 33.3465 13.7593 33.4178C12.2393 34.3259 10.9913 35.6258 10.1458 37.1816C9.97751 36.6852 9.81704 36.1869 9.67394 35.6855C9.63861 35.5619 9.57928 35.4465 9.49934 35.3459C9.41941 35.2452 9.32044 35.1613 9.20808 35.0989C9.09572 35.0366 8.97217 34.9969 8.84449 34.9823C8.71681 34.9676 8.5875 34.9783 8.46393 35.0136C8.34037 35.049 8.22497 35.1083 8.12434 35.1882C8.0237 35.2681 7.9398 35.3671 7.87741 35.4795C7.81502 35.5918 7.77538 35.7154 7.76074 35.8431C7.7461 35.9707 7.75675 36.1001 7.79209 36.2236C8.00564 36.9717 8.24659 37.7158 8.51225 38.4509C7.11792 38.1446 5.15387 38.1043 2.7637 39.0955C2.64104 39.1463 2.53002 39.2217 2.43741 39.3168C2.3448 39.412 2.27252 39.525 2.22499 39.649C2.17746 39.773 2.15566 39.9054 2.16093 40.038C2.16619 40.1707 2.19841 40.301 2.25562 40.4208C2.90542 41.6181 3.91306 42.5825 5.13772 43.1791C5.69229 43.4525 6.2989 43.6042 6.91688 43.6241C7.53487 43.6439 8.14995 43.5314 8.72091 43.2941L8.72066 43.2934ZM13.7439 35.8354C13.8271 36.361 13.8235 36.8966 13.7332 37.421C13.6743 37.7652 13.5427 38.0928 13.3472 38.382C13.1517 38.6713 12.8967 38.9155 12.5993 39.0984C12.2263 39.3298 11.7936 39.4471 11.3547 39.4357C11.5609 38.592 12.1363 37.1696 13.7439 35.8361V35.8354ZM6.00196 41.4237C5.52394 41.1873 5.08932 40.8718 4.71649 40.4905C6.72775 39.9506 8.20647 40.31 9.00687 40.6373C8.75496 41.0185 8.39366 41.3147 7.97041 41.4869C7.65677 41.6173 7.31886 41.6791 6.97936 41.6682C6.63986 41.6573 6.30661 41.574 6.00196 41.4237Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M4.97128 34.8941C5.22162 34.894 5.47149 34.8723 5.7181 34.8293C6.68744 34.6589 7.56684 34.1553 8.20441 33.4056C8.67512 33.5833 9.1741 33.6745 9.67726 33.6747C10.1422 33.6745 10.604 33.5977 11.0439 33.4474C11.6357 33.2447 12.1773 32.9178 12.6324 32.4888C13.0876 32.0597 13.4458 31.5384 13.6831 30.9596C14.2088 29.6986 14.3321 28.3061 14.0364 26.9723C14.0006 26.8431 13.9387 26.7227 13.8544 26.6184C13.7702 26.5141 13.6654 26.4283 13.5466 26.3662C13.4277 26.3041 13.2974 26.2671 13.1637 26.2574C13.03 26.2478 12.8957 26.2658 12.7692 26.3102C11.1334 26.847 9.6664 27.8022 8.51361 29.081C8.46909 28.4606 8.43655 27.8393 8.42701 27.2184C8.42507 27.0899 8.39783 26.9631 8.34687 26.8451C8.2959 26.7271 8.22219 26.6204 8.12996 26.5309C8.03772 26.4414 7.92877 26.3709 7.80931 26.3236C7.68985 26.2762 7.56223 26.2528 7.43374 26.2548C7.30524 26.2567 7.17839 26.2839 7.06042 26.3349C6.94245 26.3859 6.83567 26.4596 6.74618 26.5518C6.6567 26.644 6.58626 26.753 6.53888 26.8725C6.4915 26.9919 6.46812 27.1195 6.47006 27.248C6.48474 28.1969 6.54222 29.1475 6.6342 30.0929C5.33943 29.4689 3.40694 28.9677 0.812263 29.4149C0.680984 29.4375 0.555708 29.4867 0.444113 29.5594C0.332518 29.6322 0.236953 29.727 0.163275 29.838C0.0895977 29.9489 0.0393589 30.0738 0.0156377 30.2049C-0.00808355 30.336 -0.00478765 30.4705 0.0253234 30.6003C0.399974 31.9117 1.173 33.0743 2.23741 33.9271C3.01131 34.5526 3.97623 34.8939 4.97128 34.8941ZM12.2289 28.6629C12.1965 29.1966 12.0764 29.7212 11.8732 30.2157C11.7421 30.5367 11.5439 30.8259 11.2919 31.064C11.0399 31.3022 10.74 31.4837 10.4121 31.5964C9.99472 31.742 9.5435 31.7605 9.11561 31.6495C9.49869 30.8716 10.3683 29.6086 12.2289 28.6629ZM6.56717 32.305C6.24084 32.6188 5.82743 32.8267 5.38101 32.9017C5.04502 32.9598 4.70048 32.9456 4.37044 32.8598C4.04041 32.774 3.73251 32.6188 3.46736 32.4044C3.0518 32.0676 2.69574 31.6634 2.41403 31.2087C4.49305 31.1311 5.85753 31.8087 6.56717 32.305Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M0.973889 18.7774C0.869196 18.8605 0.782627 18.9641 0.71952 19.0819C0.656413 19.1997 0.618106 19.3292 0.60696 19.4624C0.56293 20.8273 0.941944 22.1725 1.69209 23.3136C2.03185 23.8366 2.47955 24.2807 3.00513 24.6164C3.5307 24.952 4.12199 25.1713 4.73931 25.2596C4.93672 25.2875 5.13584 25.3015 5.3352 25.3014C6.10945 25.3012 6.86853 25.0867 7.52846 24.6818C8.27494 25.2825 9.2041 25.6104 10.1623 25.6114H10.2251C10.8472 25.6013 11.4598 25.4582 12.0219 25.1917C12.5841 24.9252 13.0827 24.5415 13.4842 24.0663C14.3711 23.0287 14.9148 21.7418 15.0407 20.3826C15.0462 20.2492 15.0242 20.1161 14.9763 19.9915C14.9284 19.8669 14.8555 19.7534 14.7621 19.6581C14.6695 19.5616 14.5577 19.4857 14.4339 19.4351C14.3101 19.3845 14.1771 19.3605 14.0434 19.3645C11.7738 19.4098 10.1195 20.0539 8.96584 20.7804C9.07396 20.1913 9.19382 19.605 9.33277 19.0262C9.39365 18.7739 9.35183 18.5078 9.2165 18.2864C9.08117 18.0649 8.86342 17.9063 8.61114 17.8454C8.35887 17.7845 8.09274 17.8264 7.8713 17.9617C7.64986 18.097 7.49125 18.3148 7.43037 18.5671C7.24128 19.3498 7.08056 20.1444 6.94626 20.9438C5.89978 19.9744 4.24322 18.9514 1.72414 18.5768C1.59201 18.5573 1.45729 18.565 1.32826 18.5995C1.19923 18.634 1.07863 18.6946 0.973889 18.7774ZM11.9918 22.8009C11.7705 23.0629 11.4956 23.2745 11.1858 23.4215C10.8759 23.5685 10.5382 23.6475 10.1953 23.6532C9.74623 23.6674 9.30385 23.5416 8.92939 23.2933C9.53067 22.674 10.7442 21.7444 12.8064 21.4286C12.6128 21.9281 12.3375 22.3918 11.9918 22.8009ZM6.30536 23.1275C5.90364 23.3201 5.45353 23.3882 5.01279 23.3232C4.6719 23.2741 4.34545 23.1526 4.05534 22.967C3.76524 22.7814 3.5182 22.5358 3.33079 22.2469C3.03922 21.7981 2.82428 21.304 2.69478 20.7848C4.69455 21.3589 5.7831 22.4333 6.30536 23.1275Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M5.24206 8.54099C5.11967 8.48601 4.98728 8.45679 4.85312 8.45515C4.71896 8.45351 4.58589 8.47948 4.46219 8.53144C4.33849 8.5834 4.22679 8.66025 4.13405 8.75721C4.04131 8.85417 3.9695 8.96916 3.92308 9.09505C3.51802 10.4 3.52596 11.7982 3.94583 13.0985C4.13461 13.6957 4.44872 14.2457 4.86716 14.7117C5.2856 15.1777 5.79872 15.549 6.3722 15.8008C6.9065 16.0348 7.4834 16.1558 8.06668 16.1562C8.44994 16.1542 8.83107 16.0992 9.19927 15.9928C9.77311 16.7968 10.6101 17.3747 11.5652 17.6264C12.1643 17.7835 12.7902 17.8107 13.4007 17.7061C14.0111 17.6015 14.5922 17.3676 15.1049 17.02C16.2366 16.2597 17.1034 15.1658 17.5851 13.8903C17.6256 13.7637 17.6399 13.6301 17.6271 13.4977C17.6143 13.3653 17.5746 13.2369 17.5105 13.1204C17.4464 13.0039 17.3592 12.9016 17.2543 12.8199C17.1493 12.7382 17.0288 12.6788 16.9001 12.6452C14.6929 12.0701 12.9221 12.2448 11.6164 12.6347C11.8397 12.1699 12.0699 11.7083 12.314 11.2565C12.3772 11.1433 12.4172 11.0187 12.4318 10.8898C12.4464 10.761 12.4353 10.6306 12.399 10.5061C12.3628 10.3816 12.3021 10.2656 12.2206 10.1648C12.1392 10.0639 12.0385 9.98027 11.9244 9.91869C11.8103 9.8571 11.6851 9.8188 11.5561 9.806C11.4271 9.79321 11.2968 9.80619 11.1729 9.84417C11.0489 9.88216 10.9337 9.9444 10.834 10.0273C10.7343 10.1102 10.6521 10.212 10.5921 10.327C10.2555 10.95 9.93851 11.5875 9.63958 12.2335C8.8886 11.0173 7.5657 9.58502 5.24206 8.54099ZM15.1555 14.2974C14.8374 14.7267 14.4493 15.0994 14.0075 15.3999C13.7258 15.5909 13.4065 15.7195 13.071 15.777C12.7355 15.8346 12.3916 15.8197 12.0623 15.7335C11.6223 15.6213 11.2264 15.3788 10.9265 15.0378C11.6746 14.6031 13.0882 14.041 15.1555 14.2974ZM7.15645 14.0075C6.83822 13.8674 6.55356 13.661 6.32154 13.4021C6.08951 13.1432 5.91547 12.8377 5.81105 12.506C5.6502 11.9974 5.57425 11.4657 5.58624 10.9324C7.35631 12.0297 8.11952 13.3585 8.43924 14.1699C8.00491 14.2439 7.55866 14.1873 7.15645 14.0075Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M12.7427 8.53304C13.0631 9.47321 13.7016 10.272 14.5482 10.7916C15.0745 11.1143 15.6635 11.3211 16.2761 11.3981C16.8886 11.4751 17.5105 11.4206 18.1003 11.2383C19.4022 10.8408 20.5468 10.0452 21.3731 8.96332C21.448 8.8539 21.4999 8.73038 21.5257 8.60027C21.5514 8.47015 21.5505 8.33616 21.5228 8.20644C21.4952 8.07672 21.4415 7.95396 21.3649 7.84564C21.2884 7.73732 21.1906 7.6457 21.0776 7.57633C18.2691 5.85323 15.8818 5.88626 14.4567 6.16855C14.2838 4.71698 13.5805 2.41046 11.088 0.240447C10.9867 0.152197 10.8682 0.085782 10.74 0.0453408C10.6118 0.00489963 10.4767 -0.00869945 10.343 0.00539276C10.2093 0.019485 10.08 0.0609646 9.96308 0.127247C9.84615 0.193529 9.74413 0.283194 9.66338 0.390645C8.90144 1.52411 8.50928 2.86576 8.54083 4.23116C8.55127 4.85904 8.69515 5.47751 8.96291 6.04553C9.23068 6.61354 9.61621 7.11809 10.0939 7.5257C10.8341 8.15703 11.77 8.51293 12.7427 8.53304ZM18.9349 8.65119C18.5077 8.96845 18.0298 9.21111 17.5215 9.3689C17.1974 9.46877 16.8558 9.49849 16.5194 9.45605C16.1829 9.41362 15.8593 9.30002 15.5702 9.12281C15.1769 8.88561 14.8641 8.53543 14.6727 8.11792C15.5144 7.92149 17.0303 7.79918 18.9347 8.65168L18.9349 8.65119ZM10.7287 2.63258C12.1079 4.19814 12.4608 5.69178 12.5359 6.56336C12.1015 6.50549 11.6934 6.32202 11.3618 6.03548C11.0956 5.8077 10.8808 5.52595 10.7317 5.20891C10.5825 4.89186 10.5025 4.54675 10.4968 4.19643C10.4883 3.66599 10.5666 3.13773 10.7287 2.63258Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
const AwardLeafRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = 24 } = $$props;
  let { color = "black" } = $$props;
  let height = width * 2.3333333333;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} viewBox="${"0 0 24 56"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M6.10371 50.7454C6.67756 50.2957 7.23736 49.8298 7.77599 49.3462C7.95848 49.1824 8.06415 48.9573 8.06975 48.7204C8.07536 48.4835 7.98043 48.2542 7.80585 48.083C7.63128 47.9118 7.39137 47.8126 7.13888 47.8074C6.8864 47.8021 6.64203 47.8912 6.45954 48.055C6.0592 48.4143 5.64434 48.7608 5.22306 49.1007C5.21997 47.8462 4.88984 46.2368 3.74738 44.4364C3.68052 44.331 3.59123 44.2396 3.48508 44.168C3.37892 44.0964 3.25819 44.0461 3.13039 44.0202C3.0026 43.9942 2.87048 43.9933 2.74228 44.0174C2.61408 44.0415 2.49254 44.0901 2.38524 44.1602C1.33783 44.9252 0.570328 45.9772 0.189338 47.1702C0.0106169 47.7184 -0.0424003 48.2959 0.0337783 48.8646C0.109957 49.4334 0.313604 49.9806 0.631326 50.4703C1.12531 51.2312 1.88379 51.809 2.77891 52.1063C2.7908 53.0171 3.14067 53.8956 3.76833 54.5906C4.15632 55.0208 4.63717 55.3688 5.17911 55.6118C5.72106 55.8547 6.31177 55.987 6.91224 55.9999H7.04838C8.32472 56.0056 9.57259 55.6462 10.6257 54.9696C10.7283 54.8961 10.8138 54.8039 10.8772 54.6984C10.9406 54.593 10.9805 54.4766 10.9944 54.3562C11.0084 54.2359 10.9961 54.1142 10.9584 53.9984C10.9207 53.8826 10.8582 53.7753 10.7749 53.6829C9.15098 51.8825 7.44229 51.0869 6.10371 50.7454ZM2.00989 47.693C2.16038 47.2335 2.39001 46.8002 2.68966 46.4103C3.49342 48.1642 3.37323 49.559 3.18139 50.3388C2.79757 50.1619 2.4765 49.8845 2.25695 49.5402C2.07935 49.266 1.96561 48.9597 1.92319 48.6413C1.88078 48.3229 1.91065 47.9997 2.01085 47.693H2.00989ZM6.95175 54.2137C6.62078 54.2063 6.29525 54.1331 5.99667 53.9989C5.6981 53.8647 5.43328 53.6726 5.21973 53.4352C4.9272 53.1162 4.7428 52.7225 4.69015 52.3046C5.52986 52.3789 6.96555 52.7144 8.46598 54.0017C7.97816 54.153 7.46634 54.2248 6.9527 54.2141L6.95175 54.2137Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M16.6292 46.5663C14.6746 45.0223 12.8669 44.5593 11.5089 44.4954C12.0134 43.7523 12.4927 42.9899 12.937 42.2104C13.0022 42.1002 13.0457 41.9776 13.0651 41.8496C13.0844 41.7217 13.0792 41.591 13.0497 41.4651C13.0202 41.3393 12.967 41.2209 12.8932 41.1167C12.8195 41.0126 12.7266 40.9248 12.62 40.8585C12.5134 40.7923 12.3952 40.7488 12.2724 40.7307C12.1496 40.7126 12.0245 40.7202 11.9045 40.7531C11.7845 40.786 11.672 40.8435 11.5735 40.9222C11.475 41.001 11.3925 41.0994 11.3308 41.2118C10.9971 41.7975 10.641 42.371 10.2709 42.9352C9.86555 41.1862 9.01144 39.5856 7.80035 38.3055C7.71298 38.209 7.60767 38.1322 7.49087 38.0796C7.37406 38.0271 7.24821 38 7.12103 38H7.11332C6.98489 38.0011 6.85806 38.0299 6.74073 38.0845C6.62341 38.139 6.51812 38.2183 6.43143 38.3173C5.60303 39.3695 5.10753 40.6641 5.0132 42.0228C4.96586 42.6475 5.04615 43.2756 5.24875 43.8655C5.45135 44.4554 5.77164 44.9936 6.1884 45.4445C6.83415 46.1438 7.69147 46.5886 8.61521 46.7035C8.83386 47.6693 9.36832 48.5251 10.1264 49.1234C10.5967 49.4947 11.1373 49.7571 11.7123 49.893C12.2872 50.029 12.8833 50.0354 13.4609 49.9119C14.735 49.6444 15.8966 48.9659 16.7818 47.972C16.8631 47.8706 16.9239 47.753 16.9604 47.6263C16.9969 47.4997 17.0083 47.3666 16.994 47.2351C16.9798 47.1037 16.9401 46.9766 16.8773 46.8617C16.8146 46.7468 16.7302 46.6464 16.6292 46.5666V46.5663ZM6.87683 42.1736C6.91679 41.6473 7.03899 41.1314 7.23858 40.6464C8.407 42.3354 8.60609 43.8519 8.59815 44.7246C8.1909 44.6244 7.82044 44.4025 7.53209 44.0859C7.2996 43.8339 7.12097 43.5333 7.00802 43.2038C6.89506 42.8744 6.85034 42.5236 6.87683 42.1748V42.1736ZM13.0851 47.9981C12.7675 48.0655 12.4398 48.0616 12.1238 47.9866C11.8078 47.9116 11.5106 47.7673 11.2521 47.5633C10.8991 47.2892 10.6333 46.9105 10.4891 46.4765C11.307 46.3635 12.761 46.3923 14.4926 47.4246C14.0578 47.6977 13.5819 47.892 13.0851 47.9994V47.9981Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M21.4231 37.6248C19.1396 36.6676 17.2624 36.7061 15.9301 37.0021C16.1839 36.2925 16.4132 35.5761 16.618 34.8529C16.6517 34.7337 16.6619 34.6088 16.6479 34.4855C16.6339 34.3623 16.596 34.243 16.5364 34.1345C16.4768 34.026 16.3966 33.9305 16.3005 33.8533C16.2043 33.7762 16.0941 33.7189 15.976 33.6848C15.8579 33.6506 15.7343 33.6404 15.6123 33.6545C15.4903 33.6686 15.3723 33.7069 15.2649 33.7671C15.1576 33.8274 15.063 33.9084 14.9866 34.0055C14.9102 34.1027 14.8535 34.2141 14.8198 34.3334C14.683 34.8175 14.5297 35.2986 14.3689 35.7778C13.561 34.2758 12.3684 33.0208 10.916 32.1441C10.8072 32.0753 10.6856 32.0298 10.5587 32.0105C10.4317 31.9912 10.3022 31.9985 10.1782 32.032C10.0542 32.0655 9.93839 32.1244 9.8379 32.2051C9.73742 32.2858 9.65445 32.3865 9.59417 32.501C9.04209 33.6962 8.8691 35.0346 9.09886 36.333C9.2008 36.9298 9.42742 37.4978 9.76365 37.9992C10.0999 38.5005 10.538 38.9238 11.0488 39.2407C11.6822 39.6335 12.4108 39.8418 13.1541 39.8427C13.3366 39.8421 13.5189 39.829 13.6997 39.8032C14.1398 40.6486 14.8583 41.3121 15.7311 41.6791C16.2768 41.9083 16.8647 42.017 17.4553 41.9979C18.0459 41.9788 18.6257 41.8323 19.1557 41.5683C20.3257 40.9918 21.2882 40.0605 21.9088 38.9044C21.9634 38.7887 21.9942 38.663 21.9993 38.5348C22.0043 38.4067 21.9835 38.279 21.938 38.1592C21.8926 38.0395 21.8236 37.9304 21.7351 37.8385C21.6466 37.7467 21.5403 37.6739 21.4231 37.6248ZM12.0265 37.6291C11.7424 37.4525 11.4987 37.2167 11.3119 36.9375C11.1251 36.6582 10.9994 36.3419 10.9431 36.0097C10.8568 35.5034 10.8533 34.9863 10.9326 34.4789C12.4657 35.7641 13.0167 37.136 13.2146 37.9547C12.7957 37.9654 12.3827 37.8522 12.0265 37.6291ZM18.3304 39.8726C18.0392 40.0175 17.7208 40.0978 17.3965 40.1083C17.0721 40.1187 16.7493 40.059 16.4497 39.9331C16.0453 39.7667 15.7001 39.4809 15.4593 39.1129C16.2246 38.7969 17.6378 38.4498 19.5587 38.9712C19.2023 39.3398 18.7868 39.6449 18.3297 39.8736L18.3304 39.8726Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M23.1995 27.9264C20.6395 27.5132 18.7335 27.9764 17.4566 28.5541C17.5473 27.6788 17.604 26.7985 17.6185 25.9199C17.6204 25.8009 17.5973 25.6827 17.5506 25.5721C17.5039 25.4614 17.4344 25.3606 17.3461 25.2752C17.2578 25.1897 17.1524 25.1215 17.0361 25.0743C16.9197 25.0272 16.7945 25.002 16.6678 25.0002H16.6531C16.3996 25.0002 16.1563 25.0937 15.9757 25.2607C15.7951 25.4276 15.6917 25.6545 15.6879 25.8925C15.6785 26.4674 15.6464 27.0427 15.6025 27.6172C14.4655 26.433 13.0185 25.5485 11.4051 25.0512C11.2803 25.01 11.1479 24.9934 11.016 25.0023C10.8841 25.0113 10.7555 25.0455 10.6383 25.103C10.5211 25.1605 10.4178 25.24 10.3346 25.3366C10.2515 25.4331 10.1904 25.5447 10.1552 25.6643C9.8634 26.8994 9.98509 28.1889 10.5036 29.3566C10.7377 29.8926 11.0911 30.3753 11.54 30.7726C11.989 31.1699 12.5232 31.4726 13.1069 31.6604C13.541 31.7995 13.9964 31.8706 14.4551 31.8708C14.9513 31.8706 15.4435 31.7862 15.9077 31.6216C16.5367 32.3159 17.4042 32.7822 18.3605 32.94C18.963 33.0388 19.5812 33.0154 20.1733 32.8712C20.7654 32.7271 21.3177 32.4656 21.7932 32.1043C22.8432 31.3146 23.6057 30.2381 23.9752 29.0236C24.0048 28.9035 24.0079 28.779 23.9844 28.6577C23.961 28.5364 23.9114 28.4209 23.8387 28.3182C23.766 28.2156 23.6717 28.1279 23.5617 28.0606C23.4517 27.9933 23.3282 27.9478 23.1987 27.9268L23.1995 27.9264ZM13.7309 29.9456C13.4076 29.8412 13.1117 29.6731 12.8631 29.4526C12.6145 29.2321 12.419 28.9643 12.2897 28.6671C12.0898 28.2094 11.9719 27.7238 11.9405 27.2301C13.771 28.1044 14.6291 29.2717 15.0084 29.995C14.5868 30.0977 14.1421 30.0805 13.7309 29.9456ZM20.5814 30.6931C20.3199 30.8917 20.0161 31.0355 19.6906 31.1149C19.365 31.1943 19.0252 31.2075 18.6937 31.1536C18.2533 31.0842 17.8454 30.8916 17.5234 30.6011C18.2232 30.1413 19.5663 29.5116 21.6204 29.5859C21.3426 30.0072 20.9914 30.3817 20.5814 30.6938V30.6931Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M9.27094 18.6543C9.18037 18.7399 9.10967 18.8419 9.06321 18.9538C9.01675 19.0657 8.99551 19.1853 9.00079 19.3051C9.1229 20.5259 9.65011 21.6817 10.51 22.6137C10.8996 23.0404 11.3832 23.3848 11.9284 23.6239C12.4736 23.863 13.0678 23.9913 13.6709 24H13.7319C14.6609 23.9992 15.5618 23.7046 16.2856 23.165C16.9255 23.5289 17.6616 23.7216 18.4124 23.7218C18.6056 23.7219 18.7986 23.7093 18.9899 23.6843C19.5885 23.605 20.1618 23.408 20.6714 23.1065C21.181 22.805 21.6151 22.406 21.9445 21.9363C22.6719 20.9113 23.0394 19.703 22.9967 18.4769C22.9858 18.3573 22.9485 18.2409 22.8872 18.1351C22.8258 18.0293 22.7417 17.9362 22.6401 17.8617C22.5384 17.7872 22.4213 17.7327 22.2961 17.7017C22.1708 17.6707 22.04 17.6639 21.9118 17.6815C19.4688 18.0179 17.8631 18.9368 16.8484 19.8076C16.7182 19.0895 16.5624 18.3761 16.379 17.6727C16.3498 17.5605 16.297 17.4548 16.2237 17.3615C16.1503 17.2682 16.0578 17.1892 15.9515 17.129C15.8452 17.0688 15.7271 17.0286 15.6041 17.0107C15.481 16.9927 15.3553 16.9975 15.2342 17.0245C15.1131 17.0516 14.9989 17.1005 14.8982 17.1685C14.7975 17.2364 14.7122 17.3221 14.6472 17.4206C14.5822 17.5191 14.5388 17.6285 14.5195 17.7425C14.5002 17.8565 14.5052 17.973 14.5345 18.0852C14.6699 18.605 14.7861 19.1317 14.8903 19.6608C13.7717 19.0082 12.1676 18.4304 9.96707 18.389C9.83751 18.386 9.70868 18.408 9.58882 18.4537C9.46896 18.4993 9.3607 18.5676 9.27094 18.6543ZM20.9707 19.665C20.8452 20.1314 20.6368 20.5753 20.354 20.9783C20.1723 21.2379 19.9327 21.4584 19.6515 21.6252C19.3702 21.7919 19.0536 21.901 18.7231 21.9451C18.2959 22.0038 17.8594 21.9425 17.4701 21.7693C17.9772 21.1466 19.0322 20.182 20.9707 19.665ZM14.9249 21.9201C14.5618 22.1419 14.1337 22.2546 13.6989 22.2426C13.3664 22.2375 13.0389 22.1666 12.7385 22.0345C12.4381 21.9025 12.1716 21.7124 11.957 21.4771C11.6221 21.1097 11.3557 20.6932 11.1686 20.2446C13.1629 20.5283 14.339 21.3613 14.9249 21.9201Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M19.2225 8.07412C19.1077 8.02373 18.9841 7.99852 18.8596 8.00007C18.735 8.00161 18.6121 8.02988 18.4984 8.0831C16.3415 9.0912 15.1139 10.4758 14.4176 11.6522C14.1401 11.028 13.8459 10.412 13.5335 9.80999C13.4778 9.69894 13.4015 9.60051 13.3089 9.52043C13.2164 9.44034 13.1095 9.3802 12.9945 9.3435C12.8794 9.30679 12.7585 9.29426 12.6388 9.30662C12.519 9.31898 12.4028 9.35599 12.297 9.4155C12.1911 9.47501 12.0976 9.55583 12.022 9.65327C11.9464 9.75071 11.8901 9.86282 11.8564 9.9831C11.8228 10.1034 11.8124 10.2294 11.826 10.3539C11.8395 10.4784 11.8767 10.5988 11.9353 10.7082C12.1624 11.145 12.3758 11.5908 12.5831 12.0403C11.3707 11.6636 9.72711 11.4946 7.67896 12.05C7.55951 12.0825 7.44768 12.1399 7.35027 12.2189C7.25287 12.2978 7.17195 12.3966 7.11245 12.5092C7.05295 12.6218 7.01613 12.7458 7.00423 12.8737C6.99233 13.0016 7.0056 13.1307 7.04324 13.2531C7.49035 14.4854 8.29491 15.5422 9.34522 16.2767C9.82104 16.6126 10.3604 16.8387 10.927 16.9397C11.4936 17.0408 12.0745 17.0145 12.6305 16.8627C13.5168 16.6195 14.2935 16.0613 14.826 15.2847C15.1678 15.3875 15.5217 15.4406 15.8775 15.4426C16.4188 15.4422 16.9543 15.3252 17.4502 15.0992C17.9825 14.8559 18.4587 14.4971 18.8471 14.0468C19.2355 13.5965 19.527 13.0651 19.7022 12.488C20.0919 11.2316 20.0993 9.88057 19.7233 8.61965C19.6803 8.49779 19.6136 8.38646 19.5275 8.29261C19.4413 8.19875 19.3375 8.12438 19.2225 8.07412ZM12.1683 15.033C11.8626 15.1162 11.5434 15.1306 11.2321 15.075C10.9207 15.0194 10.6243 14.8951 10.3628 14.7106C9.95267 14.4203 9.59239 14.0601 9.29709 13.6453C11.2149 13.3973 12.5279 13.9407 13.2222 14.3607C12.9439 14.6902 12.5766 14.9245 12.1683 15.033ZM17.9703 11.9144C17.8734 12.2348 17.7119 12.53 17.4965 12.7802C17.2812 13.0304 17.017 13.2299 16.7216 13.3652C16.348 13.5392 15.9331 13.5937 15.5296 13.5219C15.8248 12.7419 16.5327 11.4556 18.1785 10.3938C18.19 10.9091 18.1196 11.4229 17.9703 11.9144Z"}"${add_attribute("fill", color, 0)}></path><path d="${"M14.1969 0.00536532C14.0632 -0.00845774 13.928 0.00449947 13.7999 0.0434228C13.6717 0.0823462 13.5533 0.146392 13.452 0.231527C10.9609 2.31994 10.2576 4.53826 10.0848 5.93618C8.66018 5.66436 6.2739 5.63259 3.46656 7.29057C3.35356 7.3573 3.25583 7.44545 3.17931 7.54966C3.1028 7.65387 3.0491 7.77197 3.02147 7.89677C2.99384 8.02158 2.99287 8.15048 3.0186 8.27566C3.04434 8.40084 3.09625 8.51967 3.17118 8.62494C3.99703 9.66571 5.14106 10.4311 6.44238 10.8136C7.03199 10.989 7.65368 11.0415 8.266 10.9674C8.87832 10.8933 9.46718 10.6943 9.99331 10.3839C10.8395 9.88404 11.4779 9.11551 11.7981 8.21098C12.7705 8.1913 13.7059 7.84867 14.4458 7.24114C14.9233 6.849 15.3087 6.36358 15.5763 5.81712C15.844 5.27065 15.9878 4.67564 15.9982 4.07158C16.0298 2.75797 15.6378 1.46721 14.8761 0.376733C14.7955 0.273232 14.6936 0.186837 14.5767 0.122942C14.4598 0.0590469 14.3305 0.0190219 14.1969 0.00536532ZM8.9717 8.77815C8.68263 8.94864 8.35916 9.05794 8.0228 9.09876C7.68644 9.13958 7.3449 9.11099 7.02091 9.0149C6.51345 8.86282 6.0364 8.62912 5.61003 8.32371C7.51289 7.50496 9.02696 7.62239 9.8686 7.81137C9.67732 8.21303 9.36478 8.54992 8.9717 8.77815ZM13.1774 5.80745C12.846 6.08329 12.4381 6.2599 12.0037 6.31555C12.0788 5.47656 12.4319 4.03934 13.8112 2.53245C13.9729 3.01904 14.0508 3.52783 14.0416 4.03863C14.036 4.37551 13.9561 4.7074 13.8072 5.01233C13.6583 5.31726 13.4438 5.58828 13.1779 5.80745H13.1774Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
const css = {
  code: ".demo-done.svelte-izad7o{font-family:'Raleway', sans-serif;font-size:1.4vw;font-weight:600;padding:.5vw 0;text-align:left;margin:0}.thank-you.svelte-izad7o{min-height:35vw;padding:1vw}.thank-note.svelte-izad7o{padding:8vw 2vw 1vw}.thank-head.svelte-izad7o{font-family:'Playfair Display', serif;font-size:2.3vw}.thank-desc.svelte-izad7o{font-family:'Raleway', sans-serif;font-size:.8vw;width:65%;margin:2vw auto 5vw}.sucDone.svelte-izad7o{border:.1vw solid #000;margin:3.8vw auto 0;padding:.3vw 0}.leaf-content.svelte-izad7o{display:flex;align-items:center;justify-content:center;margin:5vw auto}.desc.svelte-izad7o{width:24.51833vw;font-size:1.30vw}.section.svelte-izad7o{min-height:60vw;min-width:100%;position:relative;overflow:hidden}.section1.svelte-izad7o{background-size:100% 100%;color:transparent;background-repeat:no-repeat;overflow:hidden;min-height:60vw}.leaf-txt.svelte-izad7o{width:50%;font-family:'Playfair Display', serif;color:#000;font-size:1.1vw;font-weight:500}.mainHeading.svelte-izad7o{font-family:'Playfair Display', serif;font-weight:700;font-size:3.13vw}.cardText.svelte-izad7o,.cardHeading.svelte-izad7o{color:#282828;margin:auto}.cardHeading.svelte-izad7o{font-family:'Playfair Display', serif;font-weight:400;font-size:2.09vw}.cardText.svelte-izad7o{font-family:'Raleway', sans-serif;font-size:0.73vw;line-height:1.044vw}.content.svelte-izad7o{margin:20vw 0 0;width:85%}.intro.svelte-izad7o{margin:22vw 15vw 0}.section2.svelte-izad7o{position:absolute;min-height:60vw;padding:2.0866vw 0 0;top:10vh;left:58%;min-width:27vw}.input.svelte-izad7o{width:20.86vw;margin:1.044vw auto}.form.svelte-izad7o{width:26.0834vw;position:inherit}.formContent.svelte-izad7o{padding:1.82583vw}.submit.svelte-izad7o{width:20.86vw;height:2.869vw;color:#fff;background-color:#835031;margin:1vw 0 0;font-size:1.044vw;border:none}.section3.svelte-izad7o,.section4.svelte-izad7o{background-color:#E3DDD9;min-height:50vw}.section5.svelte-izad7o{background-color:#C8B8AD;overflow:hidden}.section-imgs.svelte-izad7o{background-color:#E3DDD9;text-align:center;min-height:5vw;position:relative}.section7.svelte-izad7o{background-color:#E3DDD9;overflow:hidden;position:relative;min-height:0}.section8.svelte-izad7o{min-height:50vw}.section9.svelte-izad7o{background-color:#E3DDD9;min-height:0}.section10.svelte-izad7o{min-height:50vw;padding:0 0 3vw}.section11.svelte-izad7o{overflow:hidden}.section12.svelte-izad7o{min-height:30vw;background-color:#E3DDD9}.section13.svelte-izad7o{background-color:#202020;min-height:50vw}@media screen and (max-width:900px){.svelte-izad7o::-webkit-scrollbar{display:none}.thank-you.svelte-izad7o{padding:18vw 3vw 2vw}.thank-note.svelte-izad7o{padding:10vw 6vw 2vw}.thank-desc.svelte-izad7o{font-size:3.2vw;margin:10vw auto 20vw}.sucDone.svelte-izad7o{border:.01vw solid #000;margin:15vw auto 3vw;padding:3vw 0}.demo-done.svelte-izad7o{font-size:5vw}.thank-head.svelte-izad7o{font-size:8vw}.leaf-txt.svelte-izad7o{font-size:4.5vw}.leaf-content.svelte-izad7o{margin:10vw auto 5vw}.svelte-izad7o{-ms-overflow-style:none;scrollbar-width:none}.mainHeading.svelte-izad7o{font-size:12.5vw;font-weight:400}.content.svelte-izad7o{margin:60vw auto;position:relative;top:10vw;width:100%}.intro.svelte-izad7o{width:80%;margin:auto;text-align:left}.section1.svelte-izad7o{min-height:52vw;background-size:cover}.desc.svelte-izad7o{width:320px;font-size:4.5vw;width:90%;font-weight:300}.cardHeading.svelte-izad7o{font-size:45px;line-height:50px}.cardText.svelte-izad7o{font-size:18px;line-height:25px;width:288px}.section2.svelte-izad7o{position:relative;padding:0;min-height:10vh;min-width:100%;background:#fff;left:0;top:0}.form.svelte-izad7o{width:370px;position:inherit;margin:50px auto}.input.svelte-izad7o,.submit.svelte-izad7o{width:288px}.submit.svelte-izad7o{margin:20px auto;height:auto}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $booked, $$unsubscribe_booked;
  let $formInview, $$unsubscribe_formInview;
  let $formToggler, $$unsubscribe_formToggler;
  $$unsubscribe_booked = subscribe(booked, (value) => $booked = value);
  $$unsubscribe_formInview = subscribe(formInview, (value) => $formInview = value);
  $$unsubscribe_formToggler = subscribe(formToggler, (value) => $formToggler = value);
  let innerWidth;
  let ele;
  let FName;
  let Mobile;
  let Email;
  let ptype;
  let psize;
  let soc;
  let formproptyp = [
    "Independent Home",
    "Gated Villa",
    "Apartment",
    "Office",
    "Architect/Interior Designer",
    "Builder",
    "PMC",
    "Others"
  ];
  let formpropsz = ["1501-2000", "2001-3000", "3001-4000", "4001-5000", "5001-7000", "7001-above"];
  let formstgcon = ["Early Stage", "Close To Handover", "Electrical In Progress", "Ready To Move"];
  let mfName;
  let mMobile;
  let mEmail;
  let mPtype;
  let mPsize;
  let mSoc;
  let f2Err = false;
  let mErr = false;
  let f2feed = "";
  let mfeed = "";
  onDestroy(() => {
  });
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        console.log("innerWidth-", innerWidth);
      }
    }
    $$rendered = `

<div class="${"main svelte-izad7o"}">
        <div class="${"section1 section svelte-izad7o"}" style="${"background-image: url(images/hall.jpg);"}"${add_attribute("this", ele, 0)}><div class="${"content svelte-izad7o"}"><div class="${"intro svelte-izad7o"}"><h1 class="${"mainHeading ani1 svelte-izad7o"}">Truly smart</h1>
                    <h1 class="${"mainHeading ani2 svelte-izad7o"}">Truly wireless</h1><br class="${"svelte-izad7o"}">
                    <p class="${"desc ani3 svelte-izad7o"}">The Keus smart home automation is a wireless marvel that delivers deep automation experiences that are easy to install, easier to configure and easiest to use.</p></div></div></div>

    ${``}
    
    ${!$formInview && innerWidth > 700 ? `<div class="${"section2 section svelte-izad7o"}"><div class="${"form " + escape("mx-auto", true) + " svelte-izad7o"}">${validate_component(Card, "Card").$$render(
      $$result,
      {
        class: "text-center col-12",
        style: "border:"
      },
      {},
      {
        default: () => {
          return `${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
            default: () => {
              return `${$booked == 0 ? `<form class="${"formContent svelte-izad7o"}"><h3 class="${"cardHeading mb-3 svelte-izad7o"}">Smart home demo</h3>
                        <p class="${"cardText mb-3 svelte-izad7o"}">KEUS smart home helps unlock the potential of your spaces to create memorable and transformative experiences.</p>
                        <div class="${"inputs svelte-izad7o"}"><div class="${"input svelte-izad7o"}">${validate_component(Input, "Input").$$render(
                $$result,
                {
                  type: "text",
                  placeholder: "*Full name",
                  style: "font-size:18px",
                  required: true,
                  value: FName
                },
                {
                  value: ($$value) => {
                    FName = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div>
                            <div class="${"input svelte-izad7o"}">${validate_component(Input, "Input").$$render(
                $$result,
                {
                  type: "tel",
                  invalid: f2Err,
                  feedback: f2feed,
                  placeholder: "*Mobile",
                  style: "font-size:18px",
                  required: true,
                  value: Mobile
                },
                {
                  value: ($$value) => {
                    Mobile = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div>
                            <div class="${"input svelte-izad7o"}">${validate_component(Input, "Input").$$render(
                $$result,
                {
                  type: "email",
                  placeholder: "*Email",
                  style: "font-size:18px",
                  required: true,
                  value: Email
                },
                {
                  value: ($$value) => {
                    Email = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div>
                            <div class="${"input svelte-izad7o"}">${`${validate_component(Select, "Select").$$render(
                $$result,
                {
                  placeholder: "*Property type",
                  required: true,
                  items: formproptyp,
                  value: ptype
                },
                {
                  value: ($$value) => {
                    ptype = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}`}</div>
                            <div class="${"input svelte-izad7o"}">${`${validate_component(Select, "Select").$$render(
                $$result,
                {
                  placeholder: "Property size",
                  items: formpropsz,
                  value: psize
                },
                {
                  value: ($$value) => {
                    psize = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}`}</div>
                            <div class="${"input svelte-izad7o"}">${`${validate_component(Select, "Select").$$render(
                $$result,
                {
                  placeholder: "State of construction",
                  id: "fsoc",
                  items: formstgcon,
                  value: soc
                },
                {
                  value: ($$value) => {
                    soc = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}`}</div></div>
                        ${`<button class="${"submit svelte-izad7o"}" ${""} type="${"submit"}" style="${"font-size:20px;padding:15px;"}">${`Book your appointment`}</button>`}</form>` : `${$booked == 1 ? `<div class="${"thank-you svelte-izad7o"}"><div class="${"thank-note svelte-izad7o"}"><h1 class="${"thank-head svelte-izad7o"}">Thank you for registering your interest in KEUS.</h1>
                                <p class="${"thank-desc svelte-izad7o"}">Our home automation experts will get in touch with you.</p></div>
                            <div class="${"sucDone svelte-izad7o"}">${validate_component(Row, "Row").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Col, "Col").$$render(
                    $$result,
                    {
                      class: "col-3 d-flex align-items-center justify-content-center"
                    },
                    {},
                    {
                      default: () => {
                        return `<span class="${"tick svelte-izad7o"}">${validate_component(Fa, "Fa").$$render(
                          $$result,
                          {
                            icon: faCheck,
                            size: innerWidth * 0.05 + "x"
                          },
                          {},
                          {}
                        )}</span>`;
                      }
                    }
                  )}
                                    ${validate_component(Col, "Col").$$render($$result, { class: "" }, {}, {
                    default: () => {
                      return `<h1 class="${"demo-done svelte-izad7o"}">Demo Scheduled
                                        </h1>`;
                    }
                  })}`;
                }
              })}</div></div>` : ``}`}`;
            }
          })}`;
        }
      }
    )}</div></div>` : `${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        body: true,
        isOpen: $formToggler,
        toggle: () => formToggler.set(!$formToggler)
      },
      {},
      {
        default: () => {
          return `${validate_component(ModalBody, "ModalBody").$$render(
            $$result,
            {
              style: "padding:0 0;z-index:0;display:flex"
            },
            {},
            {
              default: () => {
                return `<div class="${"form mx-auto external svelte-izad7o"}">${validate_component(Card, "Card").$$render(
                  $$result,
                  {
                    class: "text-center col-12",
                    style: "border:none"
                  },
                  {},
                  {
                    default: () => {
                      return `${validate_component(CardBody, "CardBody").$$render($$result, { style: "padding:0" }, {}, {
                        default: () => {
                          return `${$booked == 0 ? `<form class="${"formContent svelte-izad7o"}"><h3 class="${"cardHeading mb-3 svelte-izad7o"}">Smart home demo</h3>
                                <p class="${"cardText mb-3 svelte-izad7o"}">KEUS smart home helps unlock the potential of your spaces to create memorable and transformative experiences.</p>
                                <div class="${"inputs svelte-izad7o"}"><div class="${"input svelte-izad7o"}">${validate_component(Input, "Input").$$render(
                            $$result,
                            {
                              type: "text",
                              placeholder: "*Full name",
                              style: "font-size:18px",
                              required: true,
                              value: mfName
                            },
                            {
                              value: ($$value) => {
                                mfName = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )}</div>
                                    <div class="${"input svelte-izad7o"}">${validate_component(Input, "Input").$$render(
                            $$result,
                            {
                              type: "tel",
                              feedback: mfeed,
                              invalid: mErr,
                              placeholder: "*Mobile",
                              style: "font-size:18px",
                              required: true,
                              value: mMobile
                            },
                            {
                              value: ($$value) => {
                                mMobile = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )}</div>
                                    <div class="${"input svelte-izad7o"}">${validate_component(Input, "Input").$$render(
                            $$result,
                            {
                              type: "email",
                              placeholder: "*Email",
                              style: "font-size:18px",
                              required: true,
                              value: mEmail
                            },
                            {
                              value: ($$value) => {
                                mEmail = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )}</div>
                                        <div class="${"input svelte-izad7o"}">${`${validate_component(Select, "Select").$$render(
                            $$result,
                            {
                              placeholder: "*Property type",
                              required: true,
                              items: formproptyp,
                              value: mPtype
                            },
                            {
                              value: ($$value) => {
                                mPtype = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )}`}</div>
                                        <div class="${"input svelte-izad7o"}">${`${validate_component(Select, "Select").$$render(
                            $$result,
                            {
                              placeholder: "Property size",
                              items: formpropsz,
                              value: mPsize
                            },
                            {
                              value: ($$value) => {
                                mPsize = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )}`}</div>
                                        <div class="${"input svelte-izad7o"}">${`${validate_component(Select, "Select").$$render(
                            $$result,
                            {
                              placeholder: "State of construction",
                              id: "fsoc",
                              items: formstgcon,
                              value: mSoc
                            },
                            {
                              value: ($$value) => {
                                mSoc = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )}`}</div></div>
                                    ${`<button class="${"submit svelte-izad7o"}" type="${"submit"}" ${""} style="${"font-size:20px;padding:15px;"}">${`Book your appointment`}</button>`}</form>` : `${$booked == 1 ? `<div class="${"thank-you svelte-izad7o"}"><div class="${"thank-note svelte-izad7o"}"><h1 class="${"thank-head svelte-izad7o"}">Thank you for registering your interest in KEUS.</h1>
                                        <p class="${"thank-desc svelte-izad7o"}">Our home automation experts will get in touch with you.</p></div>
                                    <div class="${"sucDone svelte-izad7o"}">${validate_component(Row, "Row").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(Col, "Col").$$render(
                                $$result,
                                {
                                  class: "col-3 d-flex align-items-center justify-content-center"
                                },
                                {},
                                {
                                  default: () => {
                                    return `<span class="${"tick svelte-izad7o"}">${validate_component(Fa, "Fa").$$render(
                                      $$result,
                                      {
                                        icon: faCheck,
                                        size: innerWidth * 5e-3 + "x"
                                      },
                                      {},
                                      {}
                                    )}</span>`;
                                  }
                                }
                              )}
                                            ${validate_component(Col, "Col").$$render($$result, { class: "" }, {}, {
                                default: () => {
                                  return `<h1 class="${"demo-done h-100 d-flex align-items-center svelte-izad7o"}">Demo Scheduled
                                                </h1>`;
                                }
                              })}`;
                            }
                          })}</div></div>` : ``}`}`;
                        }
                      })}`;
                    }
                  }
                )}</div>`;
              }
            }
          )}
                ${validate_component(ModalHeader, "ModalHeader").$$render(
            $$result,
            {
              toggle: () => formToggler.set(!$formToggler),
              style: "position:absolute;top:0;right:0;border:none"
            },
            {},
            {}
          )}`;
        }
      }
    )}`}
    <div class="${"section3 section svelte-izad7o"}">${`${validate_component(MobSection3, "Mob3").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section4 section svelte-izad7o"}">${`${validate_component(MobSec4, "Mob4").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section section5 svelte-izad7o"}">${`${validate_component(MobSec5, "Mob5").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section section6 svelte-izad7o"}">${`${validate_component(MobSec6, "Mob6").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section section7 svelte-izad7o"}">${`${validate_component(MobSec7, "Mob7").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section section8 svelte-izad7o"}">${`${validate_component(MobSec8, "Mob8").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section9 section svelte-izad7o"}">${`${validate_component(MobSec9, "Mob9").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section section10 svelte-izad7o"}">${`${validate_component(MobSec10, "Mob10").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section-imgs leafContainer svelte-izad7o"}">${each(
      [
        "Present in every luxury and premium project in Hyderabad",
        "200+ Architects & Interior Designers recommend Keus",
        "Preferred Automation Brand for all Luxury / Premium Villa & Apartment Projects"
      ],
      (txt) => {
        return `<div class="${"col-lg-4 col-md-4 col-sm-12 d-inline-block svelte-izad7o"}"><div class="${"leaf-content svelte-izad7o"}">${validate_component(AwardLeafLeft, "LeafLeft").$$render(
          $$result,
          {
            width: innerWidth * 0.12
          },
          {},
          {}
        )}
                    <p class="${"leaf-txt svelte-izad7o"}">${escape(txt)}</p>
                    ${validate_component(AwardLeafRight, "LeafRight").$$render(
          $$result,
          {
            width: innerWidth * 0.12
          },
          {},
          {}
        )}</div>
            </div>`;
      }
    )}</div>
    <div class="${"section section11 svelte-izad7o"}">${`${validate_component(MobSec11, "Mob11").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section12 section svelte-izad7o"}">${`${validate_component(MobSec12, "Mob12").$$render($$result, {}, {}, {})}`}</div>
    <div class="${"section13 section svelte-izad7o"}">${`${validate_component(MobSec13, "Mob13").$$render($$result, {}, {}, {})}`}</div>
</div>`;
  } while (!$$settled);
  $$unsubscribe_booked();
  $$unsubscribe_formInview();
  $$unsubscribe_formToggler();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-e3e3217f.js.map
