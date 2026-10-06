import {
  useEffect,
  useRef
} from "react";

export default function useAutoSave(
  callback,
  data
) {

  const callbackRef =
    useRef(
      callback
    );

  useEffect(() => {

    callbackRef.current =
      callback;

  });

  useEffect(() => {

    const interval =
      setInterval(
        () => {

          callbackRef.current(
            data
          );

        },
        10000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [data]);

}