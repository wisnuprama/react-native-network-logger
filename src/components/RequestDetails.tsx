import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import JSONTree from '../compat/components/JSONTree';
import type NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import Header from './Header';
import Button from './Button';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

const Headers = ({
  title = 'Headers',
  headers,
}: {
  title: string;
  headers?: Object;
}) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View>
      <Header shareContent={headers && JSON.stringify(headers, null, 2)}>
        {title}
      </Header>
      <View style={styles.content}>
        {Object.entries(headers || {}).map(([name, value]) => (
          <View style={styles.headerContainer} key={name}>
            <Text style={styles.headerKey}>{name}: </Text>
            <Text style={styles.headerValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const LargeText: React.FC<{ children: string }> = ({ children }) => {
  const styles = useThemedStyles(themedStyles);
  let data;
  try {
    data = JSON.parse(children);
  } catch {
    data = children;
  }

  return (
    <View style={styles.largeContent}>
      <ScrollView nestedScrollEnabled>
        <View style={styles.content}>
          <JSONTree data={data} />
        </View>
      </ScrollView>
    </View>
  );
};

const RequestDetails: React.FC<Props> = ({ request, onClose }) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const styles = useThemedStyles(themedStyles);

  useEffect(() => {
    (async () => {
      const body = await request.getResponseBody();
      setResponseBody(body);
    })();
  }, [request]);

  const requestBody = request.getRequestBody();

  const getFullRequest = () => {
    const processedRequest = {
      ...request,
      response: responseBody ? JSON.parse(responseBody) : undefined,
      duration: request.duration,
    };
    return JSON.stringify(processedRequest, null, 2);
  };

  return (
    <View style={styles.container}>
      <ResultItem request={request} style={styles.info} />
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        <Headers title="Request Headers" headers={request.requestHeaders} />
        <Headers title="Response Headers" headers={request.responseHeaders} />
        <Header shareContent={requestBody}>Request Body</Header>
        <LargeText>{requestBody}</LargeText>
        <Header shareContent={responseBody}>Response Body</Header>
        <LargeText>{responseBody}</LargeText>
        <Header>More</Header>
        <Button
          onPress={() => Share.share({ message: getFullRequest() })}
          fullWidth
        >
          Share full request
        </Button>
        <Button
          onPress={() => Share.share({ message: request.curlRequest })}
          fullWidth
        >
          Share as cURL
        </Button>
      </ScrollView>
      <Button onPress={onClose} style={styles.close}>
        Close
      </Button>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 10,
    },
    info: {
      margin: 0,
    },
    close: {
      position: 'absolute',
      right: 10,
      top: 0,
    },
    scrollView: {
      width: '100%',
    },
    headerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    headerKey: { fontWeight: 'bold', color: theme.colors.text },
    headerValue: { color: theme.colors.text },
    text: {
      fontSize: 16,
      color: theme.colors.text,
    },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
    largeContent: {
      maxHeight: 300,
    },
  });

export default RequestDetails;
