import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { StepIndicator, Text, useToolbar, Button } from '@lunar-kit/core';

const STEPS = [
  { title: 'Account', description: 'Basic info' },
  { title: 'Address', description: 'Shipping address' },
  { title: 'Payment', description: 'Billing details' },
  { title: 'Confirm', description: 'Review order' },
];

export default function StepIndicatorView() {
  useToolbar({ title: 'Step Indicator' });
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-12">
        <View className="gap-4">
          <Text variant="header" size="sm">Interactive flow</Text>
          <StepIndicator 
            steps={STEPS}
            currentStep={currentStep}
          />
          <View className="flex-row gap-2 justify-center mt-8">
            <Button 
                variant="outline"
                onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
            >
                Back
            </Button>
            <Button 
                onPress={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
            >
                Next Step
            </Button>
          </View>
        </View>

        <View className="gap-4">
          <Text variant="header" size="sm">Standard Layout</Text>
          <StepIndicator 
            steps={[
                { title: 'Step 1' },
                { title: 'Step 2' },
                { title: 'Step 3' },
            ]}
            currentStep={0}
          />
        </View>

        <View className="gap-4">
          <Text variant="header" size="sm">Vertical Layout</Text>
          <View className="p-4 border border-border rounded-xl">
            <StepIndicator 
                orientation="vertical"
                steps={STEPS}
                currentStep={2}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
