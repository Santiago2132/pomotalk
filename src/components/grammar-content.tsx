import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { grammarContent } from "../data/grammar-content";

export const GrammarContent: React.FC = () => {
  const [selectedTense, setSelectedTense] = React.useState<string>("present-simple");

  // Get the current grammar content
  const currentContent = grammarContent.find(item => item.id === selectedTense) || grammarContent[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-md border-none overflow-hidden bg-gradient-to-br from-green-500/10 to-teal-500/10">
        <CardHeader className="pb-0">
          <h2 className="text-xl font-semibold">English Grammar Tenses</h2>
        </CardHeader>
        <CardBody>
          <Tabs 
            aria-label="Grammar tenses" 
            color="primary"
            variant="underlined"
            selectedKey={selectedTense}
            onSelectionChange={(key) => setSelectedTense(key as string)}
            classNames={{
              tabList: "gap-6 w-full relative rounded-none border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab 
              key="present-simple" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clock" />
                  <span>Present Simple</span>
                </div>
              }
            />
            <Tab 
              key="present-continuous" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clock" />
                  <span>Present Continuous</span>
                </div>
              }
            />
            <Tab 
              key="past-simple" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clock" />
                  <span>Past Simple</span>
                </div>
              }
            />
            <Tab 
              key="past-continuous" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clock" />
                  <span>Past Continuous</span>
                </div>
              }
            />
            <Tab 
              key="present-perfect" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clock" />
                  <span>Present Perfect</span>
                </div>
              }
            />
            <Tab 
              key="future-simple" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clock" />
                  <span>Future Simple</span>
                </div>
              }
            />
          </Tabs>

          <motion.div
            key={selectedTense}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentContent.title}</h3>
              <p className="text-gray-600">{currentContent.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Icon icon="lucide:book-open" />
                  Structure
                </h4>
                <div className="space-y-3">
                  {currentContent.structure.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-1 text-green-500">
                        <Icon icon="lucide:check-circle" width={18} />
                      </div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Icon icon="lucide:list" />
                  Examples
                </h4>
                <ul className="space-y-3">
                  {currentContent.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 text-blue-500 flex-shrink-0">
                        <Icon icon="lucide:message-circle" width={18} />
                      </div>
                      <p>{example}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                <Icon icon="lucide:info" />
                Common Uses
              </h4>
              <ul className="space-y-3">
                {currentContent.uses.map((use, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 text-purple-500 flex-shrink-0">
                      <Icon icon="lucide:zap" width={18} />
                    </div>
                    <p>{use}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
};