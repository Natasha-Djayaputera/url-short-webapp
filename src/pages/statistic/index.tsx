import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  List,
  Message,
} from "semantic-ui-react";
import DownloadableQRCode from "../../components/DownloadableQRCode";
import Navigation from "../../components/Navigation";
import { validateCustomId } from "../../helpers/id";
import {
  API_BASE_URL,
  checkStatistics,
  FailResponseBody,
  isAxiosError,
  StatisticsResponseData,
  SuccessResponseBody,
} from "../../services/api";

const StatisticPage: React.VFC = () => {
  const [stats, setStats] =
    useState<SuccessResponseBody<StatisticsResponseData>>();
  const [apiError, setApiError] = useState<Error>();
  const [fieldError, setFieldErrors] = useState<Error>();
  const shortUrl = useRef<string>(``);

  const handleCheckStatistics = async () => {
    if (shortUrl.current.length === 0) {
      setFieldErrors(new Error("Path is required"));
      return;
    } else if (shortUrl.current.length < 5) {
      setFieldErrors(new Error("Path too short"));
      return;
    } else if (shortUrl.current.length > 128) {
      setFieldErrors(new Error("Path too long"));
      return;
    } else if (!validateCustomId(shortUrl.current)) {
      setFieldErrors(new Error("Path must be alphanumeric"));
      return;
    }

    try {
      const response = await checkStatistics(shortUrl.current);

      setStats(response.data);
      console.log(stats);
      setApiError(undefined);
    } catch (e) {
      setStats(undefined);
      if (isAxiosError<FailResponseBody>(e)) {
        if (e.response?.data.error.message === "not-found") {
          setApiError(
            new Error(`Short URL with path '${shortUrl.current}' not found`)
          );
          console.log(apiError);
          return;
        }
      }
      setApiError(new Error("Unhandled exception, please try again later"));
      console.log(apiError);
    }
  };

  return (
    <>
      <Container>
        <Navigation activeItem="stats"></Navigation>
      </Container>
      <Container className="content">
        {apiError instanceof Error && (
          <Message
            error
            header="An error has occurred"
            content={apiError.message}
          />
        )}
        <Form>
          <Card centered fluid raised>
            <Card.Content>
              <Card.Header
                content="See your short link statistics here"
                textAlign="center"
              />
            </Card.Content>

            <Card.Content>
              <Form.Field error={fieldError?.message} fluid>
                <Input
                  action={{
                    content: "Check",
                    labelPosition: "right",
                    icon: "search",
                    color: "blue",
                    onClick: handleCheckStatistics,
                    type: "submit",
                  }}
                  placeholder="short-url"
                  label={`${API_BASE_URL}/`}
                  fluid
                  onChange={(e) => {
                    shortUrl.current = e.target.value;
                  }}
                />

                {fieldError instanceof Error && (
                  <Label pointing prompt>
                    {fieldError.message}
                  </Label>
                )}
              </Form.Field>
            </Card.Content>
          </Card>
        </Form>

        {stats !== undefined && (
          <Card centered fluid raised>
            <Card.Content>
              <Card.Header textAlign="center">
                {`Statistics of `}
                <Header
                  as="h3"
                  color="blue"
                  style={{ display: "inline" }}
                >{`${API_BASE_URL}/${shortUrl.current}`}</Header>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Grid columns={16} divided stretched>
                {/* CREATED AT */}
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="calendar alternate" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Created At</List.Header>
                          <List.Description as="a">
                            {stats.data.createdAt}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                {/* IS CUSTOM */}
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="edit" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Custom?</List.Header>
                          <List.Description as="a">
                            {stats.data.isCustom ? "Yes" : "No"}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                {/* ORIGINAL URL */}
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="linkify" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            icon
                            color="blue"
                            labelPosition="right"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                stats.data.originalUrl
                              )
                            }
                          >
                            Copy
                            <Icon name="copy" />
                          </Button>
                        </List.Content>
                        <List.Content>
                          <List.Header as="a">Original Url</List.Header>
                          <List.Description
                            as="a"
                            style={{ overflowWrap: "anywhere" }}
                            href={`${stats.data.originalUrl}`}
                            target="_blank"
                          >
                            {stats.data.originalUrl}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                {/* SHORT URL */}
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="linkify" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            icon
                            color="blue"
                            labelPosition="right"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                stats.data.shortenedUrl
                              )
                            }
                          >
                            Copy
                            <Icon name="copy" />
                          </Button>
                        </List.Content>
                        <List.Content>
                          <List.Header as="a">Short Url</List.Header>
                          <List.Description
                            as="a"
                            style={{ overflowWrap: "anywhere" }}
                            href={`${stats.data.shortenedUrl}`}
                            target="_blank"
                          >
                            {stats.data.shortenedUrl}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                {/* VISIT COUNT*/}
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="eye" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Visit Count</List.Header>
                          <List.Description as="a">
                            {stats.data.visitCount}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>

            <Card.Content textAlign="center">
              <DownloadableQRCode value={stats.data.shortenedUrl} />
            </Card.Content>
          </Card>
        )}
      </Container>
    </>
  );
};

export default StatisticPage;
