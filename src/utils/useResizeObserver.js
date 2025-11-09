import {
  useEffect,
  useState,
  useRef,
  useMemo,
  RefObject,
  RefCallback,
  useCallback,
} from "react";
import useResolvedElement from "./uroUtils/useResolvedElement";
import extractSize from "./uroUtils/extractSize";



const useResizeObserver = (opts = {}) => {
  // Saving the callback as a ref. With this, I don't need to put onResize in the
  // effect dep array, and just passing in an anonymous function without memoising
  // will not reinstantiate the hook's ResizeObserver.
  // console.log('opts, ==>', opts)
  const onResize = opts.onResize;
  const onResizeRef = useRef(undefined);
  onResizeRef.current = onResize;
  const round = opts.round || Math.round;

  // Using a single instance throughout the hook's lifetime
  const resizeObserverRef = useRef();

  const [size, setSize] = useState({
    width: undefined,
    height: undefined,
  });

  // In certain edge cases the RO might want to report a size change just after
  // the component unmounted.
  const didUnmount = useRef(false);
  useEffect(() => {
    didUnmount.current = false;

    return () => {
      didUnmount.current = true;
    };
  }, []);

  // Using a ref to track the previous width / height to avoid unnecessary renders.
  const previous = useRef({
    width: undefined,
    height: undefined,
  });

  // This block is kinda like a useEffect, only it's called whenever a new
  // element could be resolved based on the ref option. It also has a cleanup
  // function.
  const refCallback = useResolvedElement(
    useCallback(
      (element) => {
        // We only use a single Resize Observer instance, and we're instantiating it on demand, only once there's something to observe.
        // This instance is also recreated when the `box` option changes, so that a new observation is fired if there was a previously observed element with a different box option.
        if (
          !resizeObserverRef.current ||
          resizeObserverRef.current.box !== opts.box ||
          resizeObserverRef.current.round !== round
        ) {
          resizeObserverRef.current = {
            box: opts.box,
            round,
            instance: new ResizeObserver((entries) => {
              const entry = entries[0];

              const boxProp =
                opts.box === "border-box"
                  ? "borderBoxSize"
                  : opts.box === "device-pixel-content-box"
                    ? "devicePixelContentBoxSize"
                    : "contentBoxSize";

              // console.log('entry, boxProp ====>', entries)
              const reportedWidth = extractSize(entry, boxProp, "inlineSize");
              const reportedHeight = extractSize(entry, boxProp, "blockSize");
              // console.log('reportedHeight, reportedWidth ===>', reportedHeight, reportedWidth)

              const newWidth = reportedWidth ? round(reportedWidth) : undefined;
              const newHeight = reportedHeight ? round(reportedHeight) : undefined;

              if (
                previous.current.width !== newWidth ||
                previous.current.height !== newHeight
              ) {
                const newSize = { width: newWidth, height: newHeight };
                previous.current.width = newWidth;
                previous.current.height = newHeight;
                if (onResizeRef.current) {
                  onResizeRef.current(newSize);
                } else {
                  if (!didUnmount.current) {
                    setSize(newSize);
                  }
                }
              }
            }),
          };
        }

        resizeObserverRef.current.instance.observe(element, { box: opts.box });

        return () => {
          if (resizeObserverRef.current) {
            resizeObserverRef.current.instance.unobserve(element);
          }
        };
      },
      [opts.box, round]
    ),
    opts.ref
  );

  return useMemo(
    () => ({
      ref: refCallback,
      width: size.width,
      height: size.height,
    }),
    [refCallback, size.width, size.height]
  );
}

export default useResizeObserver;