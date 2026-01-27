import { Accordion, AccordionContent, AccordionContentText, AccordionItem, AccordionTrigger, AccordionTriggerText } from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { useToolbar } from '@/hooks/useToolbar';
import React from 'react';
import { View, ScrollView } from 'react-native';

export default function AccordionView() {
  const [value, setValue] = React.useState<string | string[]>('');
  const [multiple, setMultiple] = React.useState<string | string[]>('');

  useToolbar({
    title: 'Accordion View',
  })

  return (
    <View className="flex-1 items-center justify-center">
      <ScrollView className='w-full p-3'>
        <Text variant="title" size="xl">AccordionView</Text>

        <View className='w-full flex flex-col gap-2'>
          <Text>
            Single Accordion
          </Text>

          <Accordion type="single" value={value} onValueChange={setValue} collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <AccordionTriggerText>What is React Native?</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  React Native is an open-source mobile application framework created by Facebook.
                  It allows developers to use React along with native platform capabilities.
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <AccordionTriggerText>How does it work?</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  React Native uses native components instead of web components.
                  This provides better performance and a more native user experience.
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <AccordionTriggerText>Is it free to use?</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  Yes, React Native is completely free and open source.
                  It's licensed under the MIT License.
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <AccordionTriggerText>Is it free to use?</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum explicabo reiciendis quaerat voluptates voluptas quae dolore, iusto culpa qui perspiciatis vitae ab suscipit aliquid nihil a! Recusandae ipsum aspernatur repellendus facilis. Necessitatibus quisquam excepturi eius exercitationem sequi tempore et dignissimos temporibus a facilis, maxime quibusdam nihil tenetur ut aspernatur id sapiente impedit? Iure labore facilis aut, nostrum nemo qui velit cumque, totam fugiat harum ipsa itaque ab explicabo numquam recusandae consequatur molestiae officiis excepturi mollitia perspiciatis aliquid voluptas expedita reiciendis. Blanditiis, aspernatur similique optio porro labore tenetur obcaecati neque natus cum eos dignissimos molestiae facilis debitis illo facere fugiat, aliquid ab soluta. Illum consequuntur natus exercitationem. Modi, corporis. Ipsum sapiente nostrum exercitationem. Blanditiis hic, nisi odit nostrum eius nulla impedit praesentium soluta alias laboriosam suscipit iusto, animi pariatur esse! Illo commodi ad possimus excepturi voluptatem, ut voluptatibus eveniet, perferendis architecto obcaecati repellat magni labore. Rerum neque nobis laborum, cum expedita inventore nesciunt reiciendis, deserunt libero sunt, impedit ut ad molestias assumenda necessitatibus vitae! Harum vitae asperiores doloremque saepe quam quasi aperiam aut totam consequatur eveniet soluta, impedit dicta sequi mollitia maiores aspernatur molestias sunt, atque error hic incidunt in deleniti? Dicta fugiat asperiores provident odio perspiciatis delectus, nostrum voluptatum repudiandae?
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>

        <View className='w-full flex flex-col gap-2 mt-10'>
          <Text>
            Multiple Accordion
          </Text>
          <Accordion type="multiple" value={multiple} onValueChange={setMultiple}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <AccordionTriggerText>Features</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  Cross-platform development, hot reloading, native performance, and more.
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <AccordionTriggerText>Benefits</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  Faster development, code reusability, large community support.
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <AccordionTriggerText>Use Cases</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  Mobile apps, cross-platform solutions, MVP development.
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <AccordionTriggerText>Use Cases</AccordionTriggerText>
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentText>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, illum rem! Dolorem, culpa! Reiciendis id quidem quos quae iste nisi nobis recusandae repudiandae nemo commodi illum, debitis, quo aliquam, ratione quod autem. Laboriosam corrupti quisquam voluptatum? Vel asperiores est laudantium autem repellat sit fugit illum. Recusandae, deleniti, odit aut asperiores explicabo sunt porro hic ratione veritatis ullam maxime accusamus fugiat aliquid vitae dolores id. Ea obcaecati atque voluptate non nesciunt, commodi asperiores autem mollitia officia vero, esse exercitationem facere dolor, aspernatur dolore libero explicabo maiores! Fugit omnis at exercitationem, provident reiciendis vero dignissimos sapiente accusamus! Sed quas eligendi exercitationem optio repellat aspernatur ea reiciendis dicta, amet quibusdam dolor aliquid culpa molestiae atque impedit sunt magnam facere debitis! Provident voluptate ipsa sequi perferendis odit ullam ab nisi consequatur praesentium doloremque vitae corporis, culpa molestias eaque beatae, officia error corrupti fugit esse quasi. Mollitia, quas iusto et ducimus quo libero beatae nisi excepturi nam alias vero nobis amet rerum maxime eveniet magnam delectus ipsa temporibus minus voluptas corporis? Autem temporibus, praesentium rerum unde maiores sint ut et amet sunt harum id! Earum atque ex provident sunt corrupti asperiores iure vel ipsam similique ad commodi totam possimus, hic, et veritatis dolorem enim nisi? Ipsam exercitationem id amet facilis necessitatibus ullam rerum numquam ratione tenetur saepe. Expedita excepturi aliquid, voluptatum eligendi rem eum perspiciatis dolor repellendus voluptates neque corporis assumenda distinctio et officia tempora sapiente architecto nam commodi, cupiditate cum possimus incidunt, pariatur voluptatem? Sint natus obcaecati quae consequatur, voluptatum, veritatis dolores, cumque nam aperiam adipisci cupiditate. Impedit consequatur explicabo libero consectetur debitis dolorem minus? Sed molestiae quo voluptas mollitia natus aperiam facilis, nihil omnis ut numquam at sunt ipsum est aut eos culpa, sequi nostrum doloribus laboriosam quos ad! Deserunt officia culpa reiciendis. Natus in harum veniam dolorem assumenda voluptas, commodi autem voluptates?
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      </ScrollView>
    </View>
  );
}
