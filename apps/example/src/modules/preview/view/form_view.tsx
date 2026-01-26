import { View, Text, ScrollView } from 'react-native';
import * as z from 'zod';
import { useForms } from '../hooks/useForm';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react-native';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



export default function FormView() {
  const { form, onSubmit, countryOptions } = useForms()
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Form {...form}>
          <View className="space-y-4">
            {/* Text Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Enter your name"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    prefix={
                      <Mail size={20} color="#6b7280" />
                    }
                  />
                  <FormDescription>We'll never share your email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      variant="outline"
                      size="lg"
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>

                    <SelectContent>
                      {countryOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Textarea */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    placeholder="Tell us about yourself"
                    rows={4}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />



            <Button onPress={form.handleSubmit(onSubmit as any)}>
              Submit
            </Button>
          </View>
        </Form>
      </View>
    </ScrollView>
  );
}
