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
import { useEffect } from "react"
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
import { getUsers } from "@/lib/api"
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

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = react.useState<Date>()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editUser, setEditUser] = useState({
    name: "",
    owner: "",
    membership: "",
    super: "Super",
    status: "Active",
    created: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenEdit = (user: typeof users[0], realIndex: number) => {
    setEditingIndex(realIndex)
    setEditUser({
      name: user.name,
      owner: user.owner,
      membership: user.membership,
      super: user.super,
      status: user.status,
      created: user.created,
    })
    const parsed = new Date(user.created)
    setDate(isNaN(parsed.getTime()) ? undefined : parsed)
    setDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingIndex === null) return
    const updated = [...users]
    updated[editingIndex] = {
      ...updated[editingIndex],
      name: editUser.name,
      owner: editUser.owner,
      membership: editUser.membership,
      super: editUser.super,
      status: editUser.status,
      created: date ? format(date, "MMMM d, yyyy") : editUser.created,
    }
    setUsers(updated)
    setDialogOpen(false)
    setEditingIndex(null)
  }
  const handleDelete = (realIndex: number) => {
    setUsers(users.filter((_, i) => i !== realIndex))
  }
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const data = await getUsers()
  
        console.log("ORGANIZATIONS API RESPONSE:", data)
  
        setUsers(
    Array.isArray(data?.results)
      ? data.results.map((user: any) => ({
          id: user.id,
          name: user.name,
          owner: user.email,
          membership: String(user.memberships.length),
          super: user.is_superuser ? "Super" : "User",
          status: user.is_active ? "Active" : "Inactive",
          created: format(new Date(user.date_joined), "MMMM d, yyyy"),
        }))
      : []
  )
     } catch (error) {
    console.error("Failed to load users:", error)
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`${inter.className} sm:max-w-sm`}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit your user details.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                placeholder="User Name"
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </Field>
            <Field>
              <Label htmlFor="edit-email">User Email</Label>
              <Input
                id="edit-email"
                value={editUser.owner}
                placeholder="owner@example.com"
                onChange={(e) => setEditUser({ ...editUser, owner: e.target.value })}
              />
            </Field>
            <div className="flex flex-row gap-4">
              <div>
                <Field>
                  <Label htmlFor="edit-membership">Membership</Label>
                  <Input
                    id="edit-membership"
                    value={editUser.membership}
                    placeholder="0"
                    onChange={(e) => setEditUser({ ...editUser, membership: e.target.value })}
                  />
                </Field>
              </div>
              <Field>
                <Label>Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      {editUser.status}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-32">
                    <DropdownMenuGroup>
                      <DropdownMenuRadioGroup
                        value={editUser.status}
                        onValueChange={(val) => setEditUser({ ...editUser, status: val })}
                      >
                        <DropdownMenuRadioItem value="Active" className={inter.className}>Active</DropdownMenuRadioItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem value="Inactive" className={inter.className}>Inactive</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
            </div>
            <Field>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
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
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Email</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Membership</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Super</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Status</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Created</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                const realIndex = users.indexOf(user)
                return (
                  <TableRow key={`${user.name}-${user.owner}`} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.name}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.owner}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.membership}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">
                      <Badge variant="default">{user.super}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <Badge variant={user.status === "Active" ? "default" : "inactive"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.created}</TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={inter.className}
                            onSelect={() => handleOpenEdit(user, realIndex)}
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