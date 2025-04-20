
import * as React from "react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

export const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="section"
    className={cn("py-2", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarSection.displayName = "SidebarSection"

export const SidebarSectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-sidebar="section-title"
    className={cn(
      "mb-2 px-4 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50",
      className
    )}
    {...props}
  />
))
SidebarSectionTitle.displayName = "SidebarSectionTitle"

export const SidebarSectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} data-sidebar="section-content" className={cn("", className)} {...props} />
))
SidebarSectionContent.displayName = "SidebarSectionContent"

export const SidebarAccordion = React.forwardRef<
  React.ElementRef<typeof Accordion>,
  React.ComponentPropsWithoutRef<typeof Accordion>
>(({ className, ...props }, ref) => (
  <Accordion
    ref={ref}
    data-sidebar="accordion"
    className={cn("", className)}
    {...props}
  />
))
SidebarAccordion.displayName = "SidebarAccordion"

export const SidebarAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionItem>,
  React.ComponentPropsWithoutRef<typeof AccordionItem>
>(({ className, ...props }, ref) => (
  <AccordionItem
    ref={ref}
    data-sidebar="accordion-item"
    className={cn("border-none", className)}
    {...props}
  />
))
SidebarAccordionItem.displayName = "SidebarAccordionItem"

export const SidebarAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionTrigger>,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ className, ...props }, ref) => (
  <AccordionTrigger
    ref={ref}
    data-sidebar="accordion-trigger"
    className={cn(
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center rounded-md p-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:transition-transform",
      className
    )}
    {...props}
  />
))
SidebarAccordionTrigger.displayName = "SidebarAccordionTrigger"

export const SidebarAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionContent>,
  React.ComponentPropsWithoutRef<typeof AccordionContent>
>(({ className, ...props }, ref) => (
  <AccordionContent
    ref={ref}
    data-sidebar="accordion-content"
    className={cn("pl-4 pt-1", className)}
    {...props}
  />
))
SidebarAccordionContent.displayName = "SidebarAccordionContent"

// Fix for the SidebarDrawer component - don't forward the ref directly
export const SidebarDrawer = (props: React.ComponentProps<typeof Drawer>) => (
  <Drawer
    data-sidebar="drawer" 
    {...props} 
  />
)
SidebarDrawer.displayName = "SidebarDrawer"

export const SidebarDrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerTrigger>,
  React.ComponentPropsWithoutRef<typeof DrawerTrigger>
>(({ className, ...props }, ref) => (
  <DrawerTrigger
    ref={ref}
    data-sidebar="drawer-trigger"
    className={cn("", className)}
    {...props}
  />
))
SidebarDrawerTrigger.displayName = "SidebarDrawerTrigger"

export const SidebarDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerContent>,
  React.ComponentPropsWithoutRef<typeof DrawerContent>
>(({ className, ...props }, ref) => (
  <DrawerContent
    ref={ref}
    data-sidebar="drawer-content"
    className={cn("", className)}
    {...props}
  />
))
SidebarDrawerContent.displayName = "SidebarDrawerContent"
