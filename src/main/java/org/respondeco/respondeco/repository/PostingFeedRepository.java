package org.respondeco.respondeco.repository;

import org.respondeco.respondeco.domain.Posting;
import org.respondeco.respondeco.domain.PostingFeed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the PostingFeed entity.
 */
public interface PostingFeedRepository extends JpaRepository<PostingFeed, Long> {

    @Query("SELECT p " +
            "FROM Organization o INNER JOIN o.postingFeed pf INNER JOIN pf.postings p " +
            "WHERE o.id = :organizationid AND p.active = true " +
            "ORDER BY p.createdDate DESC ")
    public Page<Posting> getPostingsForOrganization(@Param("organizationid") Long id, Pageable pageable);

    @Query("SELECT p " +
            "FROM Project po INNER JOIN po.postingFeed pf INNER JOIN pf.postings p " +
            "WHERE po.id = :projectid AND p.active = true " +
            "ORDER BY p.createdDate DESC ")
    public Page<Posting> getPostingsForProject(@Param("projectid") Long id, Pageable pageable);

    @Query("SELECT p " +
            "FROM PostingFeed pf INNER JOIN pf.postings p " +
            "WHERE pf.id = :postingfeedid AND p.active = true " +
            "ORDER BY p.createdDate DESC ")
    public Page<Posting> getPostings(@Param("postingfeedid") Long id, Pageable pageable);
}