import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useRequest } from "./useRequest";

export function useFormSubmit(
  API: string,
  toastText: any,
  closeHandler: any = () => {},
  setRefreshTable: any = () => {}
) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeRequest = useRequest();

  const onSubmit = async (values: any, extraValues: any) => {
    const allValues = { ...values, ...extraValues };
    // filter out the __ fields; meta fields
    Object.keys(allValues).forEach((key) => {
      if (key.startsWith("__")) {
        delete allValues[key];
      }
    });
    setIsSubmitting(true);
    if (values.id) {
      const response = await makeRequest(
        `${API}/${values.id}`,
        "PUT",
        allValues
      );
      if (response.ok) {
        closeHandler();
        setRefreshTable(() => {
          return { refresh: true };
        });
      } else {
        let errorResponse = await response.json();
        console.log(errorResponse);
        // setApiError(errorResponse.detail);
      }
      setIsSubmitting(false);
    } else {
      const response = await makeRequest(API, "POST", allValues);
      if (response.ok) {
        //const data = await response.json();
        toast({
          ...toastText?.create,
          position: "top",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        closeHandler();
        setRefreshTable(() => {
          return { refresh: true };
        });
      } else {
        let errorResponse = await response.json();
        console.log(errorResponse);
      }
      setIsSubmitting(false);
    }
  };
  return [isSubmitting, onSubmit];
}
