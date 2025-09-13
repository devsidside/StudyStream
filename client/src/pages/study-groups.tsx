import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Calendar, MapPin, Search, Plus } from "lucide-react";
import { useState } from "react";

export default function StudyGroups() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for study groups - in a real app, this would come from your API
  const studyGroups = [
    {
      id: 1,
      name: "Computer Science Study Group",
      subject: "Computer Science",
      description: "Weekly study sessions for CS courses, focusing on algorithms and data structures",
      members: 15,
      maxMembers: 20,
      nextMeeting: "2025-09-15 14:00",
      location: "Library Room 201",
      tags: ["Algorithms", "Data Structures", "Programming"]
    },
    {
      id: 2,
      name: "Calculus Help Session",
      subject: "Mathematics",
      description: "Peer-to-peer tutoring for Calculus I and II",
      members: 8,
      maxMembers: 12,
      nextMeeting: "2025-09-14 16:00",
      location: "Math Building Room 105",
      tags: ["Calculus", "Mathematics", "Tutoring"]
    },
    {
      id: 3,
      name: "Biology Lab Partners",
      subject: "Biology",
      description: "Study group for biology lab work and exam preparation",
      members: 12,
      maxMembers: 15,
      nextMeeting: "2025-09-16 10:00",
      location: "Biology Lab 3",
      tags: ["Biology", "Lab Work", "Exam Prep"]
    }
  ];

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="heading-study-groups">
              Study Groups
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow students, form study groups, and collaborate on your academic journey
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-groups"
              />
            </div>
            <Button className="gap-2" data-testid="button-create-group">
              <Plus className="h-4 w-4" />
              Create Study Group
            </Button>
          </div>

          {/* Study Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow" data-testid={`card-group-${group.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg" data-testid={`text-group-name-${group.id}`}>
                        {group.name}
                      </CardTitle>
                      <CardDescription data-testid={`text-group-subject-${group.id}`}>
                        {group.subject}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" data-testid={`badge-members-${group.id}`}>
                      {group.members}/{group.maxMembers}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`text-group-description-${group.id}`}>
                    {group.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span data-testid={`text-group-members-${group.id}`}>{group.members} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span data-testid={`text-group-meeting-${group.id}`}>
                        {new Date(group.nextMeeting).toLocaleDateString()} at{" "}
                        {new Date(group.nextMeeting).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span data-testid={`text-group-location-${group.id}`}>{group.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs" data-testid={`tag-${tag.toLowerCase()}-${group.id}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" data-testid={`button-join-${group.id}`}>
                    Join Study Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-groups">
                No study groups found. Try adjusting your search or create a new group!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}