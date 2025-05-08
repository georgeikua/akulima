"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const produceSchema = z.object({
  interestedProduce: z.array(z.string()).min(1, "Please select at least one produce"),
})

type ProduceValues = z.infer<typeof produceSchema>

interface ProduceSelectorProps {
  onSubmit: (data: ProduceValues) => void
}

// Updated produce options focusing on fresh perishables
const produceOptions = [
  // Vegetables
  { value: "tomatoes", label: "Tomatoes" },
  { value: "kale", label: "Kale (Sukuma Wiki)" },
  { value: "spinach", label: "Spinach" },
  { value: "cabbage", label: "Cabbage" },
  { value: "onions", label: "Onions" },
  { value: "carrots", label: "Carrots" },
  { value: "green_peppers", label: "Green Peppers" },
  { value: "cucumber", label: "Cucumber" },
  { value: "eggplant", label: "Eggplant (Brinjal)" },
  { value: "okra", label: "Okra (Lady's Finger)" },

  // Legumes
  { value: "green_beans", label: "Green Beans" },
  { value: "peas", label: "Peas" },
  { value: "cowpeas", label: "Cowpeas (Kunde)" },

  // Fruits
  { value: "bananas", label: "Bananas" },
  { value: "mangoes", label: "Mangoes" },
  { value: "avocados", label: "Avocados" },
  { value: "passion_fruit", label: "Passion Fruit" },
  { value: "oranges", label: "Oranges" },
  { value: "watermelon", label: "Watermelon" },
  { value: "pineapples", label: "Pineapples" },
  { value: "pawpaw", label: "Pawpaw (Papaya)" },
  { value: "guava", label: "Guava" },

  // Herbs and Spices
  { value: "coriander", label: "Coriander (Dhania)" },
  { value: "mint", label: "Mint" },
  { value: "ginger", label: "Ginger" },
  { value: "chillies", label: "Chillies" },
  { value: "turmeric", label: "Turmeric" },
  { value: "garlic", label: "Garlic" },
  { value: "rosemary", label: "Rosemary" },
  { value: "basil", label: "Basil" },
]

export function ProduceSelector({ onSubmit }: ProduceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedProduce, setSelectedProduce] = useState<string[]>([])

  const form = useForm<ProduceValues>({
    resolver: zodResolver(produceSchema),
    defaultValues: {
      interestedProduce: [],
    },
  })

  const handleSelect = (value: string) => {
    const currentValues = form.getValues().interestedProduce

    let newValues: string[]
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((item) => item !== value)
    } else {
      newValues = [...currentValues, value]
    }

    form.setValue("interestedProduce", newValues)
    setSelectedProduce(newValues)
  }

  const handleRemove = (value: string) => {
    const newValues = form.getValues().interestedProduce.filter((item) => item !== value)
    form.setValue("interestedProduce", newValues)
    setSelectedProduce(newValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="interestedProduce"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Produce</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
                      {selectedProduce.length > 0 ? `${selectedProduce.length} produce selected` : "Select produce..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search produce..." />
                    <CommandList>
                      <CommandEmpty>No produce found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {produceOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => handleSelect(option.label)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProduce.includes(option.label) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Select the types of fresh produce you are interested in buying</FormDescription>
              <FormMessage />

              {selectedProduce.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedProduce.map((item) => (
                    <Badge key={item} variant="secondary" className="px-2 py-1">
                      {item}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                        onClick={() => handleRemove(item)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  )
}
