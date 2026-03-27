import { View, ScrollView } from 'react-native';
import { Alert, Text, useToolbar } from '@lunar-kit/core';

export default function AlertView() {
  useToolbar({
    title: 'Alert',
  })
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <Text variant="header" size="sm">Alert Variants</Text>

        <Alert variant="default">
          This is a default alert for general information.
        </Alert>

        <Alert variant="info">
          This is an info alert to provide helpful context.
        </Alert>

        <Alert variant="success">
          Your changes have been saved successfully!
        </Alert>

        <Alert variant="warning">
          Please review your settings before proceeding.
        </Alert>

        <Alert variant="destructive">
          An error occurred while processing your request.
        </Alert>

        <Text variant="header" size="sm" className="mt-4">Alert without Icon</Text>
        <Alert variant="info" showIcon={false}>
          This alert has the icon hidden.
        </Alert>

        <Text variant="header" size="sm" className="mt-4">Alert with Custom Content</Text>
        <Alert variant="info">
          <View>
            <Text className="font-bold text-blue-900 dark:text-blue-100">Update Available</Text>
            <Text size="sm" className="text-blue-800 dark:text-blue-200">A new version of the app is ready to install.</Text>
          </View>
        </Alert>
      </View>
    </ScrollView>
  );
}
