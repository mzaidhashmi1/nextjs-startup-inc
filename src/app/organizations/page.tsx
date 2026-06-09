'use client'

import react from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Plus } from "lucide-react"
import { Inter } from 'next/font/google'
import { Label } from "@/components/ui/label"
import { Popover } from "@/components/ui/popover"
import { useEffect } from "react"
import { getOrganizations } from "@/lib/api"

  const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = react.useState<Date>()

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newOrg, setNewOrg] = useState({ name: "", owner: "", members: "", credits: "", status: "Active" })

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editOrg, setEditOrg] = useState({ name: "", owner: "", members: "", credits: "", status: "Active", created: "" })

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      org.owner?.toLowerCase()?.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddOrganization = () => {
    if (!newOrg.name || !newOrg.owner) return
    const created = date ? format(date, "MMMM d, yyyy") : format(new Date(), "MMMM d, yyyy")
    setOrganizations([...organizations, {
      name: newOrg.name,
      owner: newOrg.owner,
      members: newOrg.members || "0",
      credits: newOrg.credits || "0",
      status: newOrg.status,
      created,
    }])
    setNewOrg({ name: "", owner: "", members: "", credits: "", status: "Active" })
    setDate(undefined)
    setAddDialogOpen(false)
  }

  const handleOpenEdit = (org: typeof organizations[0], realIndex: number) => {
    setEditingIndex(realIndex)
    setEditOrg({
      name: org.name,
      owner: org.owner,
      members: org.members,
      credits: org.credits,
      status: org.status,
      created: org.created,
    })
    const parsed = new Date(org.created)
    setDate(isNaN(parsed.getTime()) ? undefined : parsed)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingIndex === null) return
    const updated = [...organizations]
    updated[editingIndex] = {
      ...updated[editingIndex],
      name: editOrg.name,
      owner: editOrg.owner,
      members: editOrg.members,
      credits: editOrg.credits,
      status: editOrg.status,
      created: date ? format(date, "MMMM d, yyyy") : editOrg.created,
    }
    setOrganizations(updated)
    setEditDialogOpen(false)
    setEditingIndex(null)
  }

  const handleDelete = (realIndex: number) => {
    setOrganizations(organizations.filter((_, i) => i !== realIndex))
  }
  useEffect(() => {
  const loadOrganizations = async () => {
    try {
      const data = await getOrganizations()

      console.log("ORGANIZATIONS API RESPONSE:", data)

      setOrganizations(
  Array.isArray(data?.results)
    ? data.results.map((org: any) => ({
        id: org.id,
        name: org.name,
        owner: org.owner_email,
        members: String(org.member_count),
        credits: String(org.credits_balance),
        status: org.is_active ? "Active" : "Inactive",
        created: format(new Date(org.created_at), "MMMM d, yyyy"),
      }))
    : []
)
   } catch (error) {
  console.error("Failed to load organizations:", error)
} finally {
      setLoading(false)
    }
  }

  loadOrganizations()
}, [])
  return (
    <div className={inter.className}>

      <div className="flex flex-row gap-4 px-8 pt-8 pb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-9 max-w-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                All Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="All" className={inter.className}>All</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="Active" className={inter.className}>Active</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="Inactive" className={inter.className}>Inactive</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 text-white flex items-center gap-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className={`${inter.className} sm:max-w-sm`}>
              <DialogHeader>
                <DialogTitle>Add Organization</DialogTitle>
                <DialogDescription>Create a new organization.</DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" value={newOrg.name} placeholder="Organization Name" onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })} />
                </Field>
                <Field>
                  <Label htmlFor="username-1">Owner Email</Label>
                  <Input id="username-1" value={newOrg.owner} placeholder="owner@example.com" onChange={(e) => setNewOrg({ ...newOrg, owner: e.target.value })} />
                </Field>
                <div className="flex flex-row gap-4">
                  <Field>
                    <Label htmlFor="members-1">Members</Label>
                    <Input id="members-1" value={newOrg.members} placeholder="0" onChange={(e) => setNewOrg({ ...newOrg, members: e.target.value })} />
                  </Field>
                  <Field>
                    <Label htmlFor="credits-1">Credits</Label>
                    <Input id="credits-1" value={newOrg.credits} placeholder="0" onChange={(e) => setNewOrg({ ...newOrg, credits: e.target.value })} />
                  </Field>
                </div>
                <Field>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {newOrg.status}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-32">
                      <DropdownMenuGroup>
                        <DropdownMenuRadioGroup value={newOrg.status} onValueChange={(val) => setNewOrg({ ...newOrg, status: val })}>
                          <DropdownMenuRadioItem value="Active" className={inter.className}>Active</DropdownMenuRadioItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioItem value="Inactive" className={inter.className}>Inactive</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>
                <Field>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" data-empty={!date} className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                        {date ? format(date, "PPP") : <span>Date Created</span>}
                        <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
                    </PopoverContent>
                  </Popover>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAddOrganization} className="bg-blue-900">
                  Add Organization
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Edit Dialog (single instance, outside the table) ── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className={`${inter.className} sm:max-w-sm`}>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>Edit your organization details.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editOrg.name} placeholder="Organization Name" onChange={(e) => setEditOrg({ ...editOrg, name: e.target.value })} />
            </Field>
            <Field>
              <Label htmlFor="edit-owner">Owner Email</Label>
              <Input id="edit-owner" value={editOrg.owner} placeholder="owner@example.com" onChange={(e) => setEditOrg({ ...editOrg, owner: e.target.value })} />
            </Field>
            <div className="flex flex-row gap-4">
              <Field>
                <Label htmlFor="edit-members">Members</Label>
                <Input id="edit-members" value={editOrg.members} placeholder="0" onChange={(e) => setEditOrg({ ...editOrg, members: e.target.value })} />
              </Field>
              <Field>
                <Label htmlFor="edit-credits">Credits</Label>
                <Input id="edit-credits" value={editOrg.credits} placeholder="0" onChange={(e) => setEditOrg({ ...editOrg, credits: e.target.value })} />
              </Field>
            </div>
            <Field>
              <Label>Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {editOrg.status}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value={editOrg.status} onValueChange={(val) => setEditOrg({ ...editOrg, status: val })}>
                      <DropdownMenuRadioItem value="Active" className={inter.className}>Active</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="Inactive" className={inter.className}>Inactive</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
            <Field>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" data-empty={!date} className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                    {date ? format(date, "PPP") : <span>Date Created</span>}
                    <ChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveEdit} className="bg-blue-900">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="px-8">
        <div className="border border-border rounded-md overflow-hidden">
          <Table className="w-full text-sm border-collapse">
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/50">
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Name</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Owner</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Members</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Credits</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Status</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Created</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((org) => {
                  const realIndex = organizations.indexOf(org)
                 return (
            
        <TableRow
          key={org.id ?? `${org.name}-${org.owner}`}
          className="hover:bg-muted/30 transition-colors"
        >
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.name}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.owner}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.members}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.credits}</TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <Badge variant={org.status === "Active" ? "default" : "inactive"}>{org.status}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.created}</TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={inter.className}
                            onSelect={() => handleOpenEdit(org, realIndex)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className={inter.className}
                            onSelect={() => handleDelete(realIndex)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              }))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className={`${inter.className} flex items-center justify-center mt-10`}>
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select defaultValue="25">
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem className={inter.className} value="10">10</SelectItem>
                <SelectItem className={inter.className} value="25">25</SelectItem>
                <SelectItem className={inter.className} value="50">50</SelectItem>
                <SelectItem className={inter.className} value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}