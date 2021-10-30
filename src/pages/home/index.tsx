import React, { useRef, useState } from "react";
import {
  Card,
  Container,
  Form,
  FormProps,
  Input,
  Label,
  Message,
} from "semantic-ui-react";
import Navigation from "../../components/Navigation";
import { validateCustomId } from "../../helpers/id";
import { isValidHttpUrl } from "../../helpers/url";
import {
  API_BASE_URL,
  FailResponseBody,
  isAxiosError,
  shortenUrl,
  ShortUrlResponseData,
  SuccessResponseBody,
} from "../../services/api";
import DownloadableQRCode from "../../components/DownloadableQRCode";

interface CreateUrlFormErrors {
  originalUrl?: Error;
  customUrlPath?: Error;
}

const HomePage: React.VFC = () => {
  const [isCustom, setIsCustom] = useState(false);
  const originalUrl = useRef<string>(``);
  const customUrlPath = useRef<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<CreateUrlFormErrors>({});
  const [apiError, setApiError] = useState<Error>();
  const [apiResponse, setApiResponse] =
    useState<SuccessResponseBody<ShortUrlResponseData>>();

  const handleFormSubmission = async (
    _: React.FormEvent<HTMLFormElement>,
    data: FormProps
  ): Promise<void> => {
    const errors: CreateUrlFormErrors = {};

    if (originalUrl.current === "") {
      errors.originalUrl = new Error("Original URL is required");
    } else if (!isValidHttpUrl(originalUrl.current)) {
      errors.originalUrl = new Error("Original URL is invalid");
    }
    if (customUrlPath.current !== undefined) {
      if (customUrlPath.current.length === 0) {
        errors.customUrlPath = new Error("Path is required");
      } else if (customUrlPath.current.length < 5) {
        errors.customUrlPath = new Error("Path too short");
      } else if (customUrlPath.current.length > 128) {
        errors.customUrlPath = new Error("Path too long");
      } else if (!validateCustomId(customUrlPath.current)) {
        errors.customUrlPath = new Error("Path must be alphanumeric");
      }
    }
    setFieldErrors({
      originalUrl: errors.originalUrl,
      customUrlPath: errors.customUrlPath,
    });
    if (Object.keys(errors).length !== 0) {
      return;
    }

    try {
      const response = await shortenUrl(
        originalUrl.current,
        customUrlPath.current
      );

      setApiResponse(response.data);
      setApiError(undefined);

      console.log(response.data);
    } catch (e) {
      setApiResponse(undefined);
      if (isAxiosError<FailResponseBody>(e)) {
        const errorMessage = e.response?.data.error.message;

        if (errorMessage === "id-reserved") {
          setApiError(
            new Error(
              `Custom URL has been used, please try again with another value`
            )
          );

          return;
        }
      }
      setApiError(new Error("Unhandled exception, please try again later"));
    }
  };

  return (
    <>
      <Container>
        <Navigation activeItem="home"></Navigation>
      </Container>
      <Container className="content">
        {apiError instanceof Error && (
          <Message
            error
            header="An error has occurred"
            content={apiError.message}
          />
        )}
        <Form onSubmit={handleFormSubmission}>
          <Card centered fluid raised>
            <Card.Content>
              <Card.Header
                content="Send a shorter link to someone!"
                textAlign="center"
              />
            </Card.Content>

            <Card.Content>
              <Form.Input
                error={fieldErrors.originalUrl?.message}
                fluid
                size="large"
                placeholder="Original URL"
                onChange={(e) => {
                  originalUrl.current = e.target.value;
                }}
              />

              <Form.Checkbox
                toggle
                label="Custom URL"
                onChange={(_, data) => {
                  setIsCustom(data.checked === true);
                  customUrlPath.current = ``;
                }}
              />

              {isCustom && (
                <Form.Field error={fieldErrors.customUrlPath?.message} fluid>
                  <Input
                    fluid
                    className="labeled"
                    size="large"
                    label={`${API_BASE_URL}/`}
                    placeholder="custom-url"
                    onChange={(e) => {
                      customUrlPath.current = e.target.value;
                    }}
                  />

                  {fieldErrors.customUrlPath instanceof Error && (
                    <Label pointing prompt>
                      {fieldErrors.customUrlPath.message}
                    </Label>
                  )}
                </Form.Field>
              )}
            </Card.Content>

            <Card.Content>
              <Form.Button
                fluid
                content="Shorten"
                icon="hand scissors"
                color="blue"
                size="large"
              />
            </Card.Content>
          </Card>
        </Form>

        {apiResponse !== undefined && (
          <Card centered fluid raised>
            <Card.Content>
              <Card.Header textAlign="center">
                This is your shortened url
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Input
                fluid
                action={{
                  color: "blue",
                  labelPosition: "right",
                  icon: "copy",
                  content: "Copy",
                  onClick: () =>
                    navigator.clipboard.writeText(
                      apiResponse.data.shortenedUrl
                    ),
                }}
                type="button"
                value={apiResponse.data.shortenedUrl}
              />
            </Card.Content>

            <Card.Content textAlign="center">
              <DownloadableQRCode value={apiResponse.data.shortenedUrl} />
            </Card.Content>
          </Card>
        )}
      </Container>
    </>
  );
};

export default HomePage;
