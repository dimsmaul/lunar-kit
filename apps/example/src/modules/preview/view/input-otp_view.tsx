import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { InputOTP, Text, useToolbar, Button, toast } from '@lunar-kit/core';

export default function InputOTPView() {
  useToolbar({ title: 'Input OTP' });
  const [otp, setOtp] = React.useState('');

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-8">
        <View className="gap-4 items-center">
          <Text variant="header" size="sm">4-Digit OTP</Text>
          <InputOTP 
            maxLength={4} 
            onValueChange={setOtp} 
          />
          <Text className="text-muted-foreground">Value: {otp}</Text>
        </View>

        <View className="gap-4 items-center">
          <Text variant="header" size="sm">6-Digit PIN (Password)</Text>
          <InputOTP 
            maxLength={6} 
            inputType="password" 
          />
        </View>

        <View className="gap-4 items-center">
          <Text variant="header" size="sm">8-Digit Code</Text>
          <InputOTP 
            maxLength={8} 
          />
        </View>

        <Button 
          onPress={() => toast.success('OTP Verified', 'Successfully verified your code.')}
          disabled={otp.length < 4}
        >
          Verify OTP
        </Button>
      </View>
    </ScrollView>
  );
}
