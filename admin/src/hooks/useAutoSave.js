import {
  useEffect
} from "react";

export default function useAutoSave(
  callback,
  data
) {

  useEffect(() => {

    const interval =
      setInterval(
        () => {

          callback(
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